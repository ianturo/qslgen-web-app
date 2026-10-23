import { readJson, json } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const session = String(body.session ?? "").trim();
  const callsign = String(body.callsign ?? "").trim();
  if (!session || !callsign) return json({ error: "Faltan session o callsign" }, 400);
  const url =
    "https://xmldata.qrz.com/xml/?s=" +
    encodeURIComponent(session) +
    ";callsign=" +
    encodeURIComponent(callsign).replace(/%2F/gi, "/");
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "QSLApp/1.0" },
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    return json({ raw: await r.text() });
  } catch (e) {
    return json({ error: String(e.message || e) }, 500);
  }
}