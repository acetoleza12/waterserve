import {
  getEnvironment,
  jsonResponse,
  rejectRequest,
  getCurrentStaff,
} from "../../../lib/server/helpers";
import type { RequestContext } from "../../../lib/server/request-context";
import {
  getSession,
  createAdministrator,
  signIn,
  signOut,
  changePassword,
} from "../../../lib/server/authentication";
import {
  submitIncident,
  trackIncident,
  listIncidents,
  updateIncident,
} from "../../../lib/server/incidents";
import { listStaff, createStaff } from "../../../lib/server/staff";
import { getIncidentImage } from "../../../lib/server/images";
export const dynamic = "force-dynamic";
/** Validates a request, then delegates to the matching feature handler. */
async function handle(request: Request) {
  try {
    const db = getEnvironment().DB,
      url = new URL(request.url),
      path = url.pathname.replace(/^\/api\//, ""),
      method = request.method,
      user = await getCurrentStaff(request);
    if (method !== "GET" && request.headers.get("origin") !== url.origin)
      rejectRequest("Please submit from this website.", 403);
    let body: any = {};
    if (method === "POST") {
      if (Number(request.headers.get("content-length") || 0) > 15 * 1024 * 1024)
        rejectRequest("Upload is too large.", 413);
      try {
        body = await request.json();
      } catch {
        rejectRequest("Invalid request.");
      }
    }
    const context: RequestContext = {
      request,
      db,
      url,
      path,
      method,
      user,
      body,
    };
    if (path === "session" && method === "GET")
      return await getSession(context);
    if (path === "setup" && method === "POST")
      return await createAdministrator(context);
    if (path === "login" && method === "POST") return await signIn(context);
    if (path === "logout" && method === "POST") return await signOut(context);
    if (path === "reports" && method === "POST")
      return await submitIncident(context);
    if (path === "track" && method === "GET")
      return await trackIncident(context);
    if (!user) rejectRequest("Please sign in to continue.", 401);
    if (path === "staff" && method === "GET") return await listStaff(context);
    if (path === "staff" && method === "POST")
      return await createStaff(context);
    if (path === "password" && method === "POST")
      return await changePassword(context);
    if (path === "reports" && method === "GET")
      return await listIncidents(context);
    if (path.startsWith("reports/") && method === "POST")
      return await updateIncident(context);
    if (path === "image" && method === "GET")
      return await getIncidentImage(context);
    return jsonResponse({ error: "Not found" }, 404);
  } catch (e: any) {
    console.error(e.status ? e.message : "WaterServe request failed");
    return jsonResponse(
      {
        error: e.status ? e.message : "Something went wrong. Please try again.",
      },
      e.status || 500,
    );
  }
}
export const GET = handle;
export const POST = handle;
