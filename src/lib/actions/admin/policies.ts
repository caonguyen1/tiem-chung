"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";
import { flag, FormError, type FormState, must, optional, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { TAGS } from "@/lib/data/tags";

const LIST = "/admin/chinh-sach";
const table = schema.policyPages;

/** Policy page (admin module 11): create when `id` is empty, otherwise update. */
export async function savePolicy(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const title = must(form, "title", "tiêu đề", 160);
    const slug = slugify(text(form, "slug", 80) || title);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const values = {
      slug,
      title,
      body: text(form, "body", 40000),
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
  updateTag(TAGS.settings);
  redirect(LIST);
}

export async function togglePolicy(form: FormData) {
  await requireAdmin();
  await setVisible(table, TAGS.settings, Number(form.get("id")), form.get("visible") === "on");
}

export async function movePolicy(form: FormData) {
  await requireAdmin();
  await moveRow(table, TAGS.settings, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deletePolicy(form: FormData) {
  await requireAdmin();
  await db.delete(table).where(eq(table.id, Number(form.get("id"))));
  updateTag(TAGS.settings);
}
