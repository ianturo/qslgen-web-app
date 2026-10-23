import nodemailer from "nodemailer";

export const MAX_BODY = 25 * 1024 * 1024;

export function transport(user, pass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: String(pass || "").replace(/\s/g, "") },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
}

export async function readJson(req) {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY) throw new Error("Tamaño de la petición no válido");
  const text = await req.text();
  if (!text || text.length > MAX_BODY) throw new Error("Tamaño de la petición no válido");
  return JSON.parse(text);
}

export const json = (obj, status = 200) =>
  Response.json(obj, { status, headers: { "Cache-Control": "no-store" } });

export function mailError(e) {
  if (e && (e.code === "EAUTH" || e.responseCode === 535)) {
    return json({ error: "Gmail rechazó el usuario o la contraseña de aplicación" }, 401);
  }
  return json({ error: String((e && e.message) || e) }, 500);
}