import type { RequestContext } from "./request-context";
import { getEnvironment, rejectRequest, parseIncident } from "./helpers";
/** get Incident Image. */
export async function getIncidentImage({ db, url, user }: RequestContext) {
  const row = await db
    .prepare("SELECT * FROM incidents WHERE id=?")
    .bind(url.searchParams.get("id") || "")
    .first();
  if (!row || (user.role !== "admin" && row.assigned !== user.id))
    rejectRequest("Image not available.", 403);
  const r = parseIncident(row),
    key =
      url.searchParams.get("kind") === "completion" ? r.completion : r.photo;
  if (!key) rejectRequest("No image attached.", 404);
  const obj = await getEnvironment().BUCKET.get(key);
  if (!obj) rejectRequest("Image not found.", 404);
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata.contentType,
      "Cache-Control": "private, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
