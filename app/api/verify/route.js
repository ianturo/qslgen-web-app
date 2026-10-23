import { readJson, json, transport, mailError } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  try {
    const t = transport(body.user, body.pass);
    await t.verify();
    t.close();
    return json({ ok: true });
  } catch (e) {
    return mailError(e);
  }
}