"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { flag, FormError, type FormState, image, must, number, optional, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { recomputePackages } from "@/lib/admin/packages";
import { FAQ_SLOTS, GALLERY_SLOTS, vaccineSectionDefs } from "@/lib/admin/vaccine-sections";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const table = schema.vaccines;
const STATUSES = ["book", "preorder", "consult"] as const;

function ids(form: FormData, name: string) {
  return [...new Set(form.getAll(name).map(Number).filter((value) => Number.isInteger(value) && value > 0))];
}

/** Vaccine (admin module 1): create when `id` is empty, otherwise update. */
export async function saveVaccine(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  let vaccineId = 0;
  try {
    const id = Number(form.get("id")) || 0;
    const name = must(form, "name", "tên vắc xin", 120);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const status = text(form, "status", 10);
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw new FormError("Vui lòng chọn trạng thái.");

    const gallery = Array.from({ length: GALLERY_SLOTS }, (_, index) => image(form, `gallery${index}`)).filter((value): value is string => Boolean(value));
    const content = vaccineSectionDefs.flatMap((section) => {
      const body = text(form, `section_${section.key}`, 20000);
      return body ? [{ key: section.key, title: section.title, body }] : [];
    });
    const faqs = Array.from({ length: FAQ_SLOTS }, (_, index) => ({ question: text(form, `faqQ${index}`, 300), answer: text(form, `faqA${index}`, 3000) })).filter((faq) => faq.question && faq.answer);

    const values = {
      slug,
      name,
      unit: optional(form, "unit", 80),
      prevents: must(form, "prevents", "mô tả phòng bệnh", 300),
      origin: must(form, "origin", "nước sản xuất", 60),
      manufacturer: must(form, "manufacturer", "nhà sản xuất", 80),
      audience: must(form, "audience", "đối tượng tiêm", 200),
      doseCount: number(form, "doseCount", "Số liều", { min: 1, max: 20 }),
      price: number(form, "price", "Giá", { min: 0, max: 1_000_000_000, required: true }) ?? 0,
      originalPrice: number(form, "originalPrice", "Giá gốc", { min: 0, max: 1_000_000_000 }),
      status: status as (typeof STATUSES)[number],
      gallery,
      content,
      faqs,
      reviewerId: Number(form.get("reviewerId")) || null,
      isVisible: flag(form, "isVisible"),
      seoTitle: optional(form, "seoTitle", 120),
      seoDescription: optional(form, "seoDescription", 300),
    };

    await db.transaction(async (tx) => {
      if (id) {
        await tx.update(table).set(values).where(eq(table.id, id));
        vaccineId = id;
      } else {
        const [row] = await tx.insert(table).values({ ...values, sortOrder: await nextSortOrder(table) }).returning({ id: table.id });
        vaccineId = row.id;
      }
      await tx.delete(schema.vaccineDiseaseGroups).where(eq(schema.vaccineDiseaseGroups.vaccineId, vaccineId));
      const groups = ids(form, "diseaseGroupIds");
      if (groups.length) await tx.insert(schema.vaccineDiseaseGroups).values(groups.map((diseaseGroupId) => ({ vaccineId, diseaseGroupId })));
      await tx.delete(schema.vaccineAgeGroups).where(eq(schema.vaccineAgeGroups.vaccineId, vaccineId));
      const ages = ids(form, "ageGroupIds");
      if (ages.length) await tx.insert(schema.vaccineAgeGroups).values(ages.map((ageGroupId) => ({ vaccineId, ageGroupId })));
    });
    // A new price changes the original price of every package that holds this vaccine.
    await recomputePackages({ vaccineId });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.catalog);
  redirect("/admin/vac-xin");
}

export async function toggleVaccine(form: FormData) {
  await requireAdmin();
  await setVisible(table, TAGS.catalog, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveVaccine(form: FormData) {
  await requireAdmin();
  await moveRow(table, TAGS.catalog, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteVaccine(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  // A vaccine inside a package cannot be deleted (schema: restrict); the list disables the button.
  const [used] = await db.select({ id: schema.packageItems.packageId }).from(schema.packageItems).where(eq(schema.packageItems.vaccineId, id)).limit(1);
  if (used) return;
  await db.delete(table).where(eq(table.id, id));
  updateTag(TAGS.catalog);
}
