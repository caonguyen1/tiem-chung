"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { flag, FormError, type FormState, image, must, optional, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const LIST = "/admin/doi-ngu";
const table = schema.doctors;

/** Doctor (admin module 8): create when `id` is empty, otherwise update. */
export async function saveDoctor(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const title = must(form, "title", "học vị", 40);
    const name = must(form, "name", "họ tên", 120);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const values = {
      slug,
      title,
      name,
      specialty: must(form, "specialty", "chuyên khoa", 160),
      photo: image(form, "photo"),
      quote: optional(form, "quote", 400),
      bio: optional(form, "bio", 6000),
      experience: optional(form, "experience", 6000),
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
  // Doctors also appear as reviewers on vaccines and articles.
  updateTag(TAGS.doctors);
  updateTag(TAGS.catalog);
  updateTag(TAGS.articles);
  redirect(LIST);
}

export async function toggleDoctor(form: FormData) {
  await requireAdmin();
  await setVisible(table, TAGS.doctors, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveDoctor(form: FormData) {
  await requireAdmin();
  await moveRow(table, TAGS.doctors, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteDoctor(form: FormData) {
  await requireAdmin();
  // Vaccines and articles that named this doctor as reviewer lose the reviewer (schema: onDelete set null).
  await db.delete(table).where(eq(table.id, Number(form.get("id"))));
  updateTag(TAGS.doctors);
  updateTag(TAGS.catalog);
  updateTag(TAGS.articles);
}
