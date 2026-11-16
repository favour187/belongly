// Belongly — Backboard AI bridge (Cloudflare Pages Function)
// The Backboard API key lives ONLY in the BACKBOARD_API_KEY secret (server-side).
// It is never shipped to the browser or committed to GitHub.
export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  if (!env.BACKBOARD_API_KEY) return json({ ok: false, error: "ai_not_configured" }, 503);

  let inb;
  try { inb = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }
  const clean = (v, max = 120) => String(v ?? "").slice(0, max).trim();
  const buddy = clean(inb.buddyName, 60), city = clean(inb.city, 60), me = clean(inb.myName, 60) || "a newcomer";
  const lang = clean(inb.language, 40) || "English";
  const shared = Array.isArray(inb.sharedInterests) ? inb.sharedInterests.slice(0, 4).map((x) => clean(x, 30)) : [];
  const scorePct = Math.max(0, Math.min(100, parseInt(inb.score) || 0));
  if (!buddy || !city) return json({ ok: false, error: "missing_fields" }, 400);

  const prompt =
    `You help a newcomer write a warm first message to a local buddy on Belongly, a community app. ` +
    `Newcomer: ${me}. Buddy: ${buddy} in ${city}. Match score: ${scorePct}%. Shared interests: ${shared.join(", ") || "none yet"}. ` +
    `Write: (1) "hello": a friendly 2-3 sentence first message suggesting a relaxed public first meetup (library/cafe, Saturday morning) mentioning a shared interest if any. ` +
    `(2) "phrases": exactly 5 essential phrases in ${lang} for a newcomer (Hello, Thank you so much, I'm new here, Can you help me please, See you on Saturday) as [english, translation] pairs. ` +
    `Reply with ONLY valid JSON: {"hello":"...","phrases":[["...","..."]]}`;

  try {
    const r = await fetch("https://app.backboard.io/api/threads/messages", {
      method: "POST",
      headers: { "X-API-Key": env.BACKBOARD_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ content: prompt }),
    });
    const data = await r.json().catch(() => ({}));
    const content = String(data.content || "");
    // Backboard returns a billing notice as content when LLM credits are unavailable.
    if (!r.ok || !content || /free credit is reserved|add credits|subscription/i.test(content)) {
      return json({ ok: false, error: "ai_unavailable", detail: content.slice(0, 160) }, 502);
    }
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return json({ ok: false, error: "ai_bad_format" }, 502);
    const parsed = JSON.parse(match[0]);
    if (!parsed.hello || !Array.isArray(parsed.phrases)) return json({ ok: false, error: "ai_bad_format" }, 502);
    return json({ ok: true, source: "backboard", hello: String(parsed.hello).slice(0, 600),
      phrases: parsed.phrases.slice(0, 5).map((p) => [String(p[0]).slice(0, 60), String(p[1]).slice(0, 120)]) });
  } catch (e) {
    return json({ ok: false, error: "ai_network" }, 502);
  }
}
export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: false, error: "use_post" }),
    { status: 405, headers: { "Content-Type": "application/json" } });
}
