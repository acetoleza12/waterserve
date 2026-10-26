/** Sends same-origin requests and preserves server validation messages. */
export async function apiRequest(path: string, body?: any) {
  const r = await fetch("/api/" + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const d: any = await r.json();
  if (!r.ok)
    throw Object.assign(Error(d.error || "Unable to complete this request."), {
      status: r.status,
    });
  return d;
}
