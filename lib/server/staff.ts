import type { RequestContext } from "./request-context";
import {
  createId,
  jsonResponse,
  rejectRequest,
  hashPassword,
  validateText,
} from "./helpers";
/** list Staff. */
export async function listStaff({ db, user }: RequestContext) {
  if (user.role !== "admin")
    return jsonResponse([{ id: user.id, name: user.name, role: user.role }]);
  return jsonResponse(
    (
      await db
        .prepare("SELECT id,name,email,role FROM staff ORDER BY name")
        .all()
    ).results,
  );
}

/** create Staff. */
export async function createStaff({ db, user, body }: RequestContext) {
  if (user.role !== "admin")
    rejectRequest("Administrator access required.", 403);
  const name = validateText(body.name, "Name", 2, 100),
    email = validateText(body.email, "Email", 5, 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    rejectRequest("Enter a valid email.");
  if (!["maintenance", "admin"].includes(body.role))
    rejectRequest("Select a role.");
  if (
    await db.prepare("SELECT id FROM staff WHERE email=?").bind(email).first()
  )
    rejectRequest("That email already has a staff account.");
  await db
    .prepare("INSERT INTO staff(id,name,email,password,role) VALUES(?,?,?,?,?)")
    .bind(
      createId(),
      name,
      email,
      await hashPassword(validateText(body.password, "Password", 12, 128)),
      body.role,
    )
    .run();
  return jsonResponse({ ok: true });
}
