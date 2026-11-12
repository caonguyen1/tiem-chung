"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { brandIcons } from "@/components/icons/brand-icons";
import { db, schema } from "@/db";
import { flag, FormError, type FormState, image, must, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const LIST = "/admin/danh-muc";
const groups = schema.diseaseGroups;
const ages = schema.ageGroups;

/** Disease group (admin module 2): icon, short name and banner; `featured` groups show on the homepage. */
export async function saveDiseaseGroup(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const name = must(form, "name", "tên nhóm bệnh", 120);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const icon = text(form, "icon", 40);
    if (!(icon in brandIcons)) throw new FormError("Vui lòng chọn biểu tượng.");
    const values = {
      slug,
      name,
      shortName: must(form, "shortName", "tên ngắn", 40),
      icon,
      bannerImage: image(form, "bannerImage"),
      featured: flag(form, "featured"),
      isVisible: flag(form, "isVisible"),
    };
    if (id) await db.update(groups).set(values).where(eq(groups.id, id));
    else await db.insert(groups).values({ ...values, sortOrder: await nextSortOrder(groups) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.catalog);
  redirect(LIST);
}

export async function toggleDiseaseGroup(form: FormData) {
  await requireAdmin();
  await setVisible(groups, TAGS.catalog, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveDiseaseGroup(form: FormData) {
  await requireAdmin();
  await moveRow(groups, TAGS.catalog, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteDiseaseGroup(form: FormData) {
  await requireAdmin();
  // The links to vaccines are removed with it (schema: cascade); the vaccines stay.
  await db.delete(groups).where(eq(groups.id, Number(form.get("id"))));
  updateTag(TAGS.catalog);
}

/** Age range used by the vaccine filter and "Tôi nên tiêm gì?". */
export async function saveAgeGroup(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const label = must(form, "label", "tên khoảng tuổi", 60);
    const slug = slugify(text(form, "slug", 60) || label);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const values = { slug, label, isVisible: flag(form, "isVisible") };
    if (id) await db.update(ages).set(values).where(eq(ages.id, id));
    else await db.insert(ages).values({ ...values, sortOrder: await nextSortOrder(ages) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.catalog);
  redirect(LIST);
}

export async function toggleAgeGroup(form: FormData) {
  await requireAdmin();
  await setVisible(ages, TAGS.catalog, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveAgeGroup(form: FormData) {
  await requireAdmin();
  await moveRow(ages, TAGS.catalog, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteAgeGroup(form: FormData) {
  await requireAdmin();
  // Removes the "Tôi nên tiêm gì?" rules of this age range and its vaccine links (schema: cascade).
  await db.delete(ages).where(eq(ages.id, Number(form.get("id"))));
  updateTag(TAGS.catalog);
}
