import { readFile } from "node:fs/promises";
import path from "node:path";

import { UPLOAD_DIR } from "@/lib/uploads";

const types: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

/** Serves the images uploaded in the admin. Names are random and never change, so they cache for a year. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const name = parts.length === 1 ? parts[0] : "";
  const type = types[path.extname(name)];
  // One flat name made of letters, digits and dashes: nothing that could climb out of the folder.
  if (!type || !/^[a-z0-9-]+\.(webp|jpg|png)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(file), { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
