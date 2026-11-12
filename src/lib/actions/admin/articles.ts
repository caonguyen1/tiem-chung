"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { date, flag, FormError, type FormState, image, must, optional, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const articles = schema.articles;
const categories = schema.articleCategories;

/** Article, promotion or outbreak alert (admin module 9): create when `id` is empty, otherwise update. */
export async function saveArticle(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const title = must(form, "title", "tiêu đề", 200);
    const slug = slugify(text(form, "slug", 80) || title);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const categoryId = Number(form.get("categoryId"));
    if (!Number.isInteger(categoryId) || categoryId <= 0) throw new FormError("Vui lòng chọn chuyên mục.");
    const reviewerId = Number(form.get("reviewerId")) || null;

    const isOutbreakAlert = flag(form, "isOutbreakAlert");
    const level = text(form, "alertLevel", 10);
    if (isOutbreakAlert && level !== "high" && level !== "watch") throw new FormError("Vui lòng chọn mức độ cảnh báo.");

    const values = {
      slug,
      title,
      excerpt: must(form, "excerpt", "mô tả ngắn", 500),
      body: text(form, "body", 100000),
      image: image(form, "image"),
      categoryId,
      reviewerId,
      publishedAt: date(form, "publishedAt") ?? new Date(),
      isFeatured: flag(form, "isFeatured"),
      isOutbreakAlert,
      alertLevel: isOutbreakAlert ? (level as "high" | "watch") : null,
      alertTitle: isOutbreakAlert ? optional(form, "alertTitle", 160) : null,
      alertTag: isOutbreakAlert ? optional(form, "alertTag", 60) : null,
      alertTeaser: isOutbreakAlert ? optional(form, "alertTeaser", 200) : null,
      isVisible: flag(form, "isVisible"),
      seoTitle: optional(form, "seoTitle", 120),
      seoDescription: optional(form, "seoDescription", 300),
    };
    if (id) await db.update(articles).set(values).where(eq(articles.id, id));
    else await db.insert(articles).values({ ...values, sortOrder: await nextSortOrder(articles) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.articles);
  redirect("/admin/bai-viet");
}

export async function toggleArticle(form: FormData) {
  await requireAdmin();
  await setVisible(articles, TAGS.articles, Number(form.get("id")), form.get("visible") === "on");
}

export async function deleteArticle(form: FormData) {
  await requireAdmin();
  await db.delete(articles).where(eq(articles.id, Number(form.get("id"))));
  updateTag(TAGS.articles);
}

/** Article category (including "Khuyến mãi", flagged `isPromotion`). */
export async function saveCategory(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const name = must(form, "name", "tên chuyên mục", 80);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const values = {
      slug,
      name,
      isPromotion: flag(form, "isPromotion"),
      isVisible: flag(form, "isVisible"),
      seoTitle: optional(form, "seoTitle", 120),
      seoDescription: optional(form, "seoDescription", 300),
    };
    if (id) await db.update(categories).set(values).where(eq(categories.id, id));
    else await db.insert(categories).values({ ...values, sortOrder: await nextSortOrder(categories) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.articles);
  redirect("/admin/bai-viet/chuyen-muc");
}

export async function toggleCategory(form: FormData) {
  await requireAdmin();
  await setVisible(categories, TAGS.articles, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveCategory(form: FormData) {
  await requireAdmin();
  await moveRow(categories, TAGS.articles, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteCategory(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  // A category that still has articles cannot go: they would drop out of every list.
  const [used] = await db.select({ id: articles.id }).from(articles).where(eq(articles.categoryId, id)).limit(1);
  if (used) return;
  await db.delete(categories).where(eq(categories.id, id));
  updateTag(TAGS.articles);
}
