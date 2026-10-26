import type { RequestContext } from "./request-context";
import {
  getEnvironment,
  createId,
  jsonResponse,
  rejectRequest,
  hashToken,
  hashPassword,
  validateText,
  enforceRateLimit,
} from "./helpers";
/** get Session. */
export async function getSession({ db, user }: RequestContext) {
  return jsonResponse({
    user: user || null,
    needsSetup: !(await db.prepare("SELECT id FROM staff LIMIT 1").first()),
  });
}

/** create Administrator. */
export async function createAdministrator({
  request,
  db,
  body,
}: RequestContext) {
  await enforceRateLimit(request, "setup", 10);
  if (await db.prepare("SELECT id FROM staff LIMIT 1").first())
    rejectRequest("Setup has already been completed.", 409);
  if (!getEnvironment().SETUP_KEY || body.key !== getEnvironment().SETUP_KEY)
    rejectRequest("Invalid setup key.", 403);
  const name = validateText(body.name, "Name", 2, 100),
    email = validateText(body.email, "Email", 5, 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    rejectRequest("Enter a valid email.");
  await db
    .prepare("INSERT INTO staff(id,name,email,password,role) VALUES(?,?,?,?,?)")
    .bind(
      "initial-admin",
      name,
      email,
      await hashPassword(validateText(body.password, "Password", 12, 128)),
      "admin",
    )
    .run();
  return jsonResponse({ ok: true });
}

/** sign In. */
export async function signIn({ request, db, body }: RequestContext) {
  await enforceRateLimit(request, "login", 30);
  const email = validateText(body.email, "Email", 1, 150).toLowerCase(),
    pass = validateText(body.password, "Password", 1, 128);
  const s = await db
    .prepare("SELECT * FROM staff WHERE email=?")
    .bind(email)
    .first();
  if (
    !s ||
    s.role !== body.role ||
    (await hashPassword(pass, s.password.split(":")[0])) !== s.password
  )
    rejectRequest("Email, password, or selected role is incorrect.", 401);
  const token = createId() + createId();
  await db
    .prepare("INSERT INTO sessions(token,staff_id,expires) VALUES(?,?,?)")
    .bind(await hashToken(token), s.id, Date.now() + 8 * 3600000)
    .run();
  return jsonResponse({ ok: true }, 200, {
    "Set-Cookie": `ws_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
  });
}

/** sign Out. */
export async function signOut({ request, db }: RequestContext) {
  const token = /ws_session=([^;]+)/.exec(
    request.headers.get("cookie") || "",
  )?.[1];
  if (token)
    await db
      .prepare("DELETE FROM sessions WHERE token=?")
      .bind(await hashToken(token))
      .run();
  return jsonResponse({ ok: true }, 200, {
    "Set-Cookie":
      "ws_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
  });
}

/** change Password. */
export async function changePassword({ db, user, body }: RequestContext) {
  const s = await db
    .prepare("SELECT password FROM staff WHERE id=?")
    .bind(user.id)
    .first();
  if (
    (await hashPassword(
      validateText(body.current, "Current password", 1, 128),
      s.password.split(":")[0],
    )) !== s.password
  )
    rejectRequest("Current password is incorrect.");
  await db.batch([
    db
      .prepare("UPDATE staff SET password=? WHERE id=?")
      .bind(
        await hashPassword(
          validateText(body.password, "New password", 12, 128),
        ),
        user.id,
      ),
    db.prepare("DELETE FROM sessions WHERE staff_id=?").bind(user.id),
  ]);
  return jsonResponse({ ok: true });
}
