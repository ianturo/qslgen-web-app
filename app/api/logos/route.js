import fs from "fs/promises";
import path from "path";
import { LOGOS, IMG_TYPES } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET() {
  let names = [];
  try {
    names = (await fs.readdir(LOGOS))
      .filter((n) => path.extname(n).toLowerCase() in IMG_TYPES)
      .sort();
  } catch {}
  return Response.json({ logos: names }, { headers: { "Cache-Control": "no-store" } });
}