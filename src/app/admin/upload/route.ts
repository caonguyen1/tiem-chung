import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { getAdmin } from "@/lib/auth/session";
import { ensureUploadDir, MAX_UPLOAD_BYTES, sniffImage } from "@/lib/uploads";

/** Receives an image already cropped in the browser (see ImageField) and stores it. Returns its address. */
export async function POST(request: Request) {
  if (!(await getAdmin())) return Response.json({ error: "Chưa đăng nhập." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Không có tệp ảnh." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "Ảnh quá lớn (tối đa 4 MB)." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return Response.json({ error: "Chỉ nhận ảnh JPG, PNG hoặc WebP." }, { status: 415 });

  const name = `${randomUUID()}.${type}`;
  await writeFile(path.join(await ensureUploadDir(), name), bytes);
  return Response.json({ url: `/uploads/${name}` });
}
