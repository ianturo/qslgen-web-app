import path from "path";
import { ROOT, serveFile } from "@/lib/files";

export const dynamic = "force-dynamic";

export const GET = () => serveFile(path.join(ROOT, "manual.html"), "text/html; charset=utf-8");