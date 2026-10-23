import path from "path";
import { LOGOS, IMG_TYPES, serveFile } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const name = path.basename(decodeURIComponent(params.name)); // sin subcarpetas ni ".."
  const type = IMG_TYPES[path.extname(name).toLowerCase()];
  if (!type) return Response.json({ error: "No encontrado" }, { status: 404 });
  return serveFile(path.join(LOGOS, name), type, "max-age=3600");
}