import { readJson, json, transport, mailError } from "@/lib/mail";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  try {
    const { user, pass, to } = body;
    if (!user || !pass || !to) return json({ error: "Faltan user, pass o to" }, 400);
    const t = transport(user, pass);
    try {
      await t.sendMail({
        from: body.fromName ? { name: body.fromName, address: user } : user,
        to,
        subject: body.subject || "QSL",
        text: body.text || "",
        attachments: (body.attachments || []).map((a) => ({
          filename: a.filename || "qsl.jpg",
          content: Buffer.from(a.data, "base64"),
          contentType: a.mime || "image/jpeg",
        })),
      });
    } finally {
      t.close();
    }
    return json({ ok: true });
  } catch (e) {
    return mailError(e);
  }
}