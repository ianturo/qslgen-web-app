import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);

// Los logos viven en public/logos (se sirven como estáticos en /logos/<archivo>).
export async function GET() {
  let names = [];
  for (const dir of [path.join(process.cwd(), "public", "logos"), path.join(process.cwd(), "logos")]) {
    try {
      names = (await fs.readdir(dir)).filter((n) => IMG_EXT.has(path.extname(n).toLowerCase())).sort();
      break;
    } catch {}
  }
  return Response.json({ logos: names }, { headers: { "Cache-Control": "no-store" } });
}