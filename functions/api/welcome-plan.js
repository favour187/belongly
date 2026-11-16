// Pages fallback: forward to the dedicated belongly-api Worker (same contract).
export async function onRequestPost(context) {
  try {
    const body = await context.request.text();
    const r = await fetch("https://belongly-api.favprojects.workers.dev/api/welcome-plan", {
      method: "POST", headers: { "Content-Type": "application/json" }, body });
    return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
  } catch { return new Response(JSON.stringify({ ok: false, error: "ai_unavailable" }), { status: 502, headers: { "Content-Type": "application/json" } }); }
}
