import type { RequestContext } from "./request-context";
import {
  createId,
  jsonResponse,
  rejectRequest,
  validateText,
  enforceRateLimit,
  savePhoto,
  parseIncident,
} from "./helpers";
/** submit Incident. */
export async function submitIncident({ request, db, body }: RequestContext) {
  await enforceRateLimit(request, "report", 15);
  const name = validateText(body.name, "Full name", 2, 100),
    phone = validateText(body.phone, "Contact number", 7, 25),
    address = validateText(body.address, "Service address", 5, 300),
    barangay = validateText(body.barangay, "Barangay", 2, 100),
    description = validateText(body.description, "Description", 15, 3000);
  if (!/^[+\d ()-]{7,25}$/.test(phone))
    rejectRequest("Enter a valid contact number.");
  if (
    ![
      "Water leak",
      "Broken pipe",
      "Low pressure",
      "Discolored water",
      "No water supply",
      "Other issue",
    ].includes(body.type)
  )
    rejectRequest("Choose an issue type.");
  if (body.consent !== true)
    rejectRequest(
      "Please agree to the use of your details to handle this report.",
    );
  const code =
      "WS-" + createId().replaceAll("-", "").slice(0, 16).toUpperCase(),
    now = new Date().toISOString();
  const data = {
    name,
    phone,
    address,
    barangay,
    description,
    type: body.type,
    account: typeof body.account === "string" ? body.account.slice(0, 50) : "",
    photo: await savePhoto(body.photo, "incident"),
    completion: null,
    created: now,
    history: [
      {
        id: createId(),
        status: "Submitted",
        note: "Your report has been received and is awaiting review.",
        actor: "Resident",
        time: now,
      },
    ],
  };
  await db
    .prepare(
      "INSERT INTO incidents(id,code,status,assigned,data,updated) VALUES(?,?,?,NULL,?,?)",
    )
    .bind(createId(), code, "Submitted", JSON.stringify(data), now)
    .run();
  return jsonResponse({ code }, 201);
}

/** track Incident. */
export async function trackIncident({ request, db, url }: RequestContext) {
  await enforceRateLimit(request, "track", 240);
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!/^WS-[A-F0-9]{16}$/.test(code))
    rejectRequest("Enter your complete tracking code.");
  const row = await db
    .prepare("SELECT * FROM incidents WHERE code=?")
    .bind(code)
    .first();
  if (!row) rejectRequest("No report found. Check your tracking code.", 404);
  const r = parseIncident(row);
  return jsonResponse({
    report: {
      code: r.code,
      type: r.type,
      description: r.description,
      barangay: r.barangay,
      status: r.status,
      created: r.created,
      updated: r.updated,
    },
    history: r.history.map(({ actor, ...h }: any) => h),
  });
}

/** list Incidents. */
export async function listIncidents({ db, user }: RequestContext) {
  const rows =
    user.role === "admin"
      ? await db.prepare("SELECT * FROM incidents ORDER BY updated DESC").all()
      : await db
          .prepare(
            "SELECT * FROM incidents WHERE assigned=? ORDER BY updated DESC",
          )
          .bind(user.id)
          .all();
  return jsonResponse(rows.results.map(parseIncident));
}

/** update Incident. */
export async function updateIncident({ db, path, user, body }: RequestContext) {
  const rid = path.split("/")[1],
    row = await db
      .prepare("SELECT * FROM incidents WHERE id=?")
      .bind(rid)
      .first();
  if (!row) rejectRequest("Report not found.", 404);
  const r = parseIncident(row);
  let status = "",
    note = "",
    assigned = r.assigned;
  if (body.action === "assign") {
    if (user.role !== "admin")
      rejectRequest("Administrator access required.", 403);
    if (!["Submitted", "Assigned"].includes(r.status))
      rejectRequest("Work has already started.");
    const s = await db
      .prepare("SELECT * FROM staff WHERE id=? AND role=?")
      .bind(body.staffId || "", "maintenance")
      .first();
    if (!s) rejectRequest("Select a maintenance staff member.");
    assigned = s.id;
    status = "Assigned";
    note = "A maintenance worker has been assigned to your report.";
  } else {
    if (user.role !== "admin" && r.assigned !== user.id)
      rejectRequest("This job is not assigned to you.", 403);
    if (body.action === "start" && r.status === "Assigned") {
      status = "In Progress";
      note = "The maintenance team has started work on this incident.";
    } else if (body.action === "resolve" && r.status === "In Progress") {
      status = "Resolved";
      note = validateText(body.notes, "Repair notes", 10, 2000);
      r.completion = await savePhoto(body.photo, "completion");
    } else
      rejectRequest(
        "This action is not available for the current status.",
        409,
      );
  }
  const now = new Date().toISOString();
  r.history.push({ id: createId(), status, note, actor: user.name, time: now });
  const data = { ...r };
  delete data.id;
  delete data.code;
  delete data.status;
  delete data.assigned;
  delete data.updated;
  const result = await db
    .prepare(
      "UPDATE incidents SET status=?,assigned=?,data=?,updated=? WHERE id=? AND updated=?",
    )
    .bind(status, assigned, JSON.stringify(data), now, rid, row.updated)
    .run();
  if (!result.meta.changes)
    rejectRequest("This report changed. Refresh and try again.", 409);
  return jsonResponse({ ok: true });
}
