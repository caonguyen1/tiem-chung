"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { flag, FormError, type FormState, image, must, number, optional, slugify, text, uniqueViolation, url } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const LIST = "/admin/trung-tam";
const table = schema.centers;

/** Vaccination center (admin module 7): create when `id` is empty, otherwise update. */
export async function saveCenter(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const name = must(form, "name", "tên trung tâm", 160);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const values = {
      slug,
      name,
      address: must(form, "address", "địa chỉ", 300),
      addressOld: optional(form, "addressOld", 300),
      province: must(form, "province", "tỉnh / thành phố", 80),
      ward: optional(form, "ward", 80),
      latitude: number(form, "latitude", "Vĩ độ", { min: -90, max: 90 }),
      longitude: number(form, "longitude", "Kinh độ", { min: -180, max: 180 }),
      openingHours: must(form, "openingHours", "giờ hoạt động", 120),
      phone: must(form, "phone", "số điện thoại", 40),
      image: image(form, "image"),
      mapUrl: url(form, "mapUrl", "Link bản đồ"),
      mapEmbedUrl: url(form, "mapEmbedUrl", "Link nhúng bản đồ", 1200),
      isVisible: flag(form, "isVisible"),
      seoTitle: optional(form, "seoTitle", 120),
      seoDescription: optional(form, "seoDescription", 300),
    };
    if (id) await db.update(table).set(values).where(eq(table.id, id));
    else await db.insert(table).values({ ...values, sortOrder: await nextSortOrder(table) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.centers);
  redirect(LIST);
}

export async function toggleCenter(form: FormData) {
  await requireAdmin();
  await setVisible(table, TAGS.centers, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveCenter(form: FormData) {
  await requireAdmin();
  await moveRow(table, TAGS.centers, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteCenter(form: FormData) {
  await requireAdmin();
  // Appointments keep their rows; their center is cleared (schema: onDelete set null).
  await db.delete(table).where(eq(table.id, Number(form.get("id"))));
  updateTag(TAGS.centers);
}
