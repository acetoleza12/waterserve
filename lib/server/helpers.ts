import { env } from "cloudflare:workers";
/** Shared response, validation, authentication, and upload helpers. */
export const getEnvironment = () => env as any,
  createId = () => crypto.randomUUID();
export const jsonResponse = (v: any, status = 200, extra: any = {}) =>
  Response.json(v, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
export function rejectRequest(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
export const toHex = (v: ArrayBuffer) =>
  Array.from(new Uint8Array(v), (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
export async function hashToken(v: string) {
  return toHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v)),
  );
}
export async function hashPassword(v: string, salt = createId()) {
  const k = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(v),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return (
    salt +
    ":" +
    toHex(
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: new TextEncoder().encode(salt),
          iterations: 100000,
          hash: "SHA-256",
        },
        k,
        256,
      ),
    )
  );
}
export function validateText(v: any, label: string, min = 1, max = 200) {
  if (typeof v !== "string" || v.trim().length < min || v.trim().length > max)
    rejectRequest(`${label} must contain ${min}–${max} characters.`);
  return v.trim();
}
export async function getCurrentStaff(req: Request) {
  const token = /ws_session=([^;]+)/.exec(req.headers.get("cookie") || "")?.[1];
  if (!token) return null;
  return getEnvironment()
    .DB.prepare(
      "SELECT s.id,s.name,s.email,s.role FROM sessions t JOIN staff s ON s.id=t.staff_id WHERE t.token=? AND t.expires>?",
    )
    .bind(await hashToken(token), Date.now())
    .first();
}
export async function enforceRateLimit(
  req: Request,
  scope: string,
  max: number,
) {
  const key =
    scope +
    ":" +
    (await hashToken(
      (req.headers.get("cf-connecting-ip") || "local") +
        ":" +
        Math.floor(Date.now() / 3600000),
    ));
  const r = await getEnvironment()
    .DB.prepare(
      "INSERT INTO limits(key,count) VALUES(?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
    )
    .bind(key)
    .first();
  if (r.count > max)
    rejectRequest("Too many attempts. Please try again in an hour.", 429);
}
export async function savePhoto(v: any, prefix: string) {
  if (!v) return null;
  if (typeof v !== "string") rejectRequest("Invalid image.");
  const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(v);
  if (!m) rejectRequest("Choose a JPG or PNG image.");
  const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  if (bytes.length > 5 * 1024 * 1024)
    rejectRequest("Photo must be 5 MB or smaller.");
  if (
    m[1] === "png"
      ? !(
          bytes[0] === 137 &&
          bytes[1] === 80 &&
          bytes[2] === 78 &&
          bytes[3] === 71
        )
      : !(bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
  )
    rejectRequest("The image file is invalid.");
  const key = prefix + "/" + createId();
  await getEnvironment().BUCKET.put(key, bytes, {
    httpMetadata: { contentType: "image/" + m[1] },
  });
  return key;
}
export const parseIncident = (r: any) => ({
  ...JSON.parse(r.data),
  id: r.id,
  code: r.code,
  status: r.status,
  assigned: r.assigned,
  updated: r.updated,
});
