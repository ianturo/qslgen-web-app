import fs from "fs/promises";
import path from "path";

export const ROOT = process.cwd();
export const LOGOS = path.join(ROOT, "logos");
export const IMG_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

export async function serveFile(file, type, cache = "no-store") {
  try {
    const data = await fs.readFile(file);
    return new Response(data, { headers: { "Content-Type": type, "Cache-Control": cache } });
  } catch {
    return Response.json({ error: "No encontrado" }, { status: 404 });
  }
}