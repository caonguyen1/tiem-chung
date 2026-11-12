import "server-only";

import { mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Where images uploaded in the admin are stored. Outside `public/`, because files added to `public/`
 * after the build are not served. On the client's server this folder must be a persistent volume.
 * Files are served by `src/app/uploads/[...path]/route.ts`.
 */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "data/uploads");

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  return UPLOAD_DIR;
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** File type from the first bytes, so a renamed file is not trusted. */
export function sniffImage(bytes: Uint8Array): "webp" | "jpg" | "png" | null {
  if (bytes.length > 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "webp";
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  return null;
}
