"""
Servidor mínimo para el Generador de QSL.

- Sirve index.html, manual.html y los logos de la carpeta logos/ (/api/logos los lista).
- /api/qrz  : reenvía la consulta a xmldata.qrz.com (evita el bloqueo CORS del navegador).
- /api/send : envía un correo por SMTP de Gmail con la contraseña de aplicación recibida.

No guarda nada: no hay base de datos, archivos ni logs con datos del usuario.
Solo usa la biblioteca estándar de Python (3.8+).

Uso:  python server.py   ->  http://localhost:8000
"""
import base64
import json
import os
import smtplib
import ssl
import sys
import urllib.parse
import urllib.request
from email.message import EmailMessage
from email.utils import formataddr
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("QSL_HOST", "0.0.0.0")
PORT = int(os.environ.get("QSL_PORT", "8000"))
ROOT = os.path.dirname(os.path.abspath(__file__))
MAX_BODY = 25 * 1024 * 1024  # Gmail admite ~25 MB por mensaje
LOGOS = os.path.join(ROOT, "logos")  # logos predefinidos; basta con copiar más imágenes aquí
IMG_TYPES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif"}


class Handler(BaseHTTPRequestHandler):
    server_version = "QSLApp/1.0"

    def log_message(self, fmt, *args):
        # Solo método y ruta, nunca cuerpos ni parámetros.
        sys.stderr.write("%s %s\n" % (self.command, self.path.split("?")[0]))

    def _json(self, code, obj):
        data = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > MAX_BODY:
            raise ValueError("Tamaño de la petición no válido")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def _file(self, path, ctype, cache="no-store"):
        with open(path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", cache)
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = urllib.parse.unquote(self.path.split("?")[0])
        if path in ("/", "/index.html"):
            self._file(os.path.join(ROOT, "index.html"), "text/html; charset=utf-8")
        elif path == "/manual.html":
            self._file(os.path.join(ROOT, "manual.html"), "text/html; charset=utf-8")
        elif path == "/favicon.ico":
            self._file(os.path.join(ROOT, "favicon.ico"), "image/x-icon", "max-age=86400")
        elif path == "/api/logos":
            names = sorted(n for n in os.listdir(LOGOS) if os.path.splitext(n)[1].lower() in IMG_TYPES) if os.path.isdir(LOGOS) else []
            self._json(200, {"logos": names})
        elif path.startswith("/logos/"):
            name = os.path.basename(path[len("/logos/"):])  # sin subcarpetas ni "..": solo archivos de logos/
            ext = os.path.splitext(name)[1].lower()
            full = os.path.join(LOGOS, name)
            if ext in IMG_TYPES and os.path.isfile(full):
                self._file(full, IMG_TYPES[ext], "max-age=3600")
            else:
                self._json(404, {"error": "No encontrado"})
        else:
            self._json(404, {"error": "No encontrado"})

    def do_POST(self):
        try:
            body = self._body()
        except Exception as e:
            return self._json(400, {"error": str(e)})
        path = self.path.split("?")[0]
        try:
            if path == "/api/qrz":
                return self._qrz(body)
            if path == "/api/send":
                return self._send(body)
            if path == "/api/verify":
                return self._verify(body)
            self._json(404, {"error": "No encontrado"})
        except smtplib.SMTPAuthenticationError:
            self._json(401, {"error": "Gmail rechazó el usuario o la contraseña de aplicación"})
        except Exception as e:
            self._json(500, {"error": str(e)})

    # --- QRZ -------------------------------------------------------------
    def _qrz(self, body):
        session = str(body.get("session", "")).strip()
        callsign = str(body.get("callsign", "")).strip()
        if not session or not callsign:
            return self._json(400, {"error": "Faltan session o callsign"})
        url = "https://xmldata.qrz.com/xml/?s=%s;callsign=%s" % (
            urllib.parse.quote(session, safe=""),
            urllib.parse.quote(callsign, safe="/"),
        )
        req = urllib.request.Request(url, headers={"User-Agent": "QSLApp/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            text = r.read().decode("utf-8", "replace")
        self._json(200, {"raw": text})

    # --- Gmail -----------------------------------------------------------
    @staticmethod
    def _smtp(user, password):
        s = smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ssl.create_default_context(), timeout=30)
        try:
            s.login(user, password.replace(" ", ""))
        except smtplib.SMTPServerDisconnected:
            # Gmail a veces corta la conexión en lugar de responder 535
            raise smtplib.SMTPAuthenticationError(535, b"login rechazado")
        return s

    def _verify(self, body):
        s = self._smtp(body["user"], body["pass"])
        s.quit()
        self._json(200, {"ok": True})

    def _send(self, body):
        user, password, to = body["user"], body["pass"], body["to"]
        msg = EmailMessage()
        msg["From"] = formataddr((body.get("fromName") or "", user))
        msg["To"] = to
        msg["Subject"] = body.get("subject") or "QSL"
        msg.set_content(body.get("text") or "")
        for att in body.get("attachments", []):
            maintype, _, subtype = (att.get("mime") or "image/jpeg").partition("/")
            msg.add_attachment(
                base64.b64decode(att["data"]),
                maintype=maintype,
                subtype=subtype,
                filename=att.get("filename") or "qsl.jpg",
            )
        s = self._smtp(user, password)
        try:
            s.send_message(msg)
        finally:
            s.quit()
        self._json(200, {"ok": True})


if __name__ == "__main__":
    print("Generador de QSL en http://%s:%d  (Ctrl+C para salir)" % (HOST, PORT))
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
