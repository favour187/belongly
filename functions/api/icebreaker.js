// Belongly Pages fallback for /api/icebreaker (primary backend is the belongly-api Worker).
// Uses GROQ_API_KEY Pages secret server-side only. Same response contract as the Worker.
export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
  if (!env.GROQ_API_KEY) return json({ ok: false, error: "ai_not_configured" }, 503);
  let inb; try { inb = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }
  const clean = (v, m = 120) => String(v ?? "").slice(0, m).trim();
  const buddy = clean(inb.buddyName, 60), city = clean(inb.city, 60);
  if (!buddy || !city) return json({ ok: false, error: "missing_fields" }, 400);
  const shared = Array.isArray(inb.sharedInterests) ? inb.sharedInterests.slice(0, 4).map(x => clean(x, 30)) : [];
  const prompt = `You help a newcomer write a warm first message to a local buddy on Belongly. Newcomer: ${clean(inb.myName,60)||"a newcomer"}. Buddy: ${buddy} in ${city}. Shared interests: ${shared.join(", ")||"none yet"}. Write (1) "hello": friendly 2-3 sentence first message suggesting a relaxed public meetup Saturday morning. (2) "phrases": exactly 5 essential phrases in ${clean(inb.language,40)||"English"} as [english, translation] pairs (Hello / Thank you so much / I'm new here / Can you help me please / See you on Saturday). Reply ONLY valid JSON: {"hello":"...","phrases":[["...","..."]]}`;
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-oss-20b", temperature: 0.6, max_tokens: 1400, reasoning_effort: "low", messages: [{ role: "user", content: prompt }] }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return json({ ok: false, error: "ai_unavailable" }, 502);
    const content = String(((data.choices || [])[0] || {}).message?.content || "").trim();
    const m = content.match(/\{[\s\S]*\}/);
    if (m) { const parsed = JSON.parse(m[0]); if (parsed.hello) return json({ ok: true, source: "groq-pages-fallback", hello: String(parsed.hello).slice(0,600), phrases: Array.isArray(parsed.phrases)?parsed.phrases.slice(0,5):[] }); }
    if (content) return json({ ok: true, source: "groq-pages-fallback", hello: content.slice(0,600), phrases: [] });
    return json({ ok: false, error: "ai_unavailable" }, 502);
  } catch { return json({ ok: false, error: "ai_unavailable" }, 502); }
}
