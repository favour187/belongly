// Belongly API — dedicated backend (Cloudflare Worker)
// Frontend (Cloudflare Pages) calls this service. The Groq key lives ONLY
// in the GROQ_API_KEY Worker secret — never in frontend code or GitHub.
const MODEL = "openai/gpt-oss-20b";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors } });

async function askGroq(env, { buddy, city, me, lang, shared, scorePct }) {
  const prompt =
    `You help a newcomer write a warm first message to a local buddy on Belongly, a community app. ` +
    `Newcomer: ${me}. Buddy: ${buddy} in ${city}. Match score: ${scorePct}%. Shared interests: ${shared.join(", ") || "none yet"}. ` +
    `Write: (1) "hello": a friendly 2-3 sentence first message suggesting a relaxed public first meetup (library or cafe, Saturday morning), mentioning a shared interest if any. ` +
    `(2) "phrases": exactly 5 essential phrases in ${lang} for a newcomer (Hello / Thank you so much / I'm new here / Can you help me please / See you on Saturday) as [english, translation] pairs. ` +
    `Reply with ONLY valid JSON in exactly this shape: {"hello":"...","phrases":[["Hello","..."],["Thank you so much","..."],["I'm new here","..."],["Can you help me, please?","..."],["See you on Saturday!","..."]]}`;
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, temperature: 0.6, max_tokens: 1400, reasoning_effort: "low",
      messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data.error && data.error.message) || `groq_http_${r.status}`);
  const content = String(((data.choices || [])[0] || {}).message?.content || "").trim();
  const m = content.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const parsed = JSON.parse(m[0]);
      if (parsed.hello) return { hello: String(parsed.hello).slice(0, 600),
        phrases: Array.isArray(parsed.phrases) ? parsed.phrases.slice(0, 5).map(p => {
          if (Array.isArray(p)) return [String(p[0]).slice(0,60), String(p[1]).slice(0,120)];
          if (p && typeof p === "object") { const en = p.english ?? p.en ?? ""; const tr = Object.entries(p).find(([k]) => !/english|^en$/i.test(k)); return [String(en).slice(0,60), String(tr ? tr[1] : "").slice(0,120)]; }
          return [String(p).slice(0,60), ""]; }) : [] };
    } catch {}
  }
  if (content) return { hello: content.slice(0, 600), phrases: [] }; // model answered in plain text
  throw new Error("groq_empty");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return json({ service: "belongly-api", status: "ok", ai: env.GROQ_API_KEY ? "groq-configured" : "groq-not-configured", model: MODEL });
    }
    if (request.method !== "POST" || url.pathname !== "/api/icebreaker") return json({ ok: false, error: "not_found" }, 404);
    if (!env.GROQ_API_KEY) return json({ ok: false, error: "ai_not_configured" }, 503);
    let inb; try { inb = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }
    const clean = (v, max = 120) => String(v ?? "").slice(0, max).trim();
    const buddy = clean(inb.buddyName, 60), city = clean(inb.city, 60);
    if (!buddy || !city) return json({ ok: false, error: "missing_fields" }, 400);
    try {
      const out = await askGroq(env, { buddy, city, me: clean(inb.myName, 60) || "a newcomer",
        lang: clean(inb.language, 40) || "English",
        shared: Array.isArray(inb.sharedInterests) ? inb.sharedInterests.slice(0, 4).map(x => clean(x, 30)) : [],
        scorePct: Math.max(0, Math.min(100, parseInt(inb.score) || 0)) });
      return json({ ok: true, source: "groq", model: MODEL, ...out });
    } catch (e) { return json({ ok: false, error: "ai_unavailable", detail: String(e.message || e).slice(0, 160) }, 502); }
  },
};
