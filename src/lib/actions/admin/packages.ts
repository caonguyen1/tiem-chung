"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { brandIcons } from "@/components/icons/brand-icons";
import { db, schema } from "@/db";
import { flag, FormError, type FormState, image, must, number, optional, slugify, text, uniqueViolation } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { recomputePackages } from "@/lib/admin/packages";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const table = schema.vaccinePackages;

/** Vaccine package (admin module 3). Doses, vaccine count and original price are worked out from the items. */
export async function savePackage(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const name = must(form, "name", "tên gói", 120);
    const slug = slugify(text(form, "slug", 80) || name);
    if (!slug) throw new FormError("Đường dẫn (slug) chưa hợp lệ.");
    const kind = text(form, "kind", 10);
    if (kind !== "age" && kind !== "audience") throw new FormError("Vui lòng chọn loại gói.");
    const icon = text(form, "icon", 40);
    if (!(icon in brandIcons)) throw new FormError("Vui lòng chọn biểu tượng.");

    const vaccineIds = form.getAll("itemVaccine").map(Number);
    const doses = form.getAll("itemDoses").map(Number);
    const items = vaccineIds.flatMap((vaccineId, index) => (Number.isInteger(vaccineId) && vaccineId > 0 ? [{ vaccineId, doses: doses[index] }] : []));
    if (items.length === 0) throw new FormError("Gói cần có ít nhất một vắc xin.");
    if (new Set(items.map((item) => item.vaccineId)).size !== items.length) throw new FormError("Một vắc xin chỉ được chọn một lần trong gói (tăng số mũi thay vì thêm dòng).");
    if (items.some((item) => !Number.isInteger(item.doses) || item.doses < 1 || item.doses > 20)) throw new FormError("Số mũi mỗi vắc xin phải từ 1 đến 20.");

    const values = {
      slug,
      name,
      kind,
      audienceLabel: must(form, "audienceLabel", "đối tượng / độ tuổi", 80),
      icon,
      image: image(form, "image"),
      description: optional(form, "description", 600),
      price: number(form, "price", "Giá gói", { min: 0, max: 1_000_000_000, required: true }) ?? 0,
      highlight: optional(form, "highlight", 40),
      isVisible: flag(form, "isVisible"),
      seoTitle: optional(form, "seoTitle", 120),
      seoDescription: optional(form, "seoDescription", 300),
    } as const;

    let packageId = id;
    await db.transaction(async (tx) => {
      if (id) await tx.update(table).set(values).where(eq(table.id, id));
      else {
        // Counts and original price are filled in by recomputePackages below.
        const [row] = await tx.insert(table).values({ ...values, doseCount: 0, vaccineCount: 0, originalPrice: 0, sortOrder: await nextSortOrder(table) }).returning({ id: table.id });
        packageId = row.id;
      }
      await tx.delete(schema.packageItems).where(eq(schema.packageItems.packageId, packageId));
      await tx.insert(schema.packageItems).values(items.map((item, index) => ({ packageId, vaccineId: item.vaccineId, doses: item.doses, sortOrder: index })));
    });
    await recomputePackages({ packageId });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const duplicate = uniqueViolation(error);
    if (duplicate) return { error: duplicate };
    throw error;
  }
  updateTag(TAGS.catalog);
  redirect("/admin/goi-vac-xin");
}

export async function togglePackage(form: FormData) {
  await requireAdmin();
  await setVisible(table, TAGS.catalog, Number(form.get("id")), form.get("visible") === "on");
}

export async function movePackage(form: FormData) {
  await requireAdmin();
  await moveRow(table, TAGS.catalog, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deletePackage(form: FormData) {
  await requireAdmin();
  // Items go with the package; "Tôi nên tiêm gì?" rules that pointed to it lose the package (schema: set null).
  await db.delete(table).where(eq(table.id, Number(form.get("id"))));
  updateTag(TAGS.catalog);
}

/** "Tôi nên tiêm gì?" (admin module 4): replaces every rule of one age range. */
export async function saveRules(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const ageGroupId = Number(form.get("ageGroupId"));
  if (!Number.isInteger(ageGroupId) || ageGroupId <= 0) return { error: "Khoảng tuổi không hợp lệ." };
  const genders = text(form, "mode", 10) === "split" ? (["nu", "nam"] as const) : (["all"] as const);

  await db.transaction(async (tx) => {
    await tx.delete(schema.recommendationRules).where(eq(schema.recommendationRules.ageGroupId, ageGroupId));
    for (const gender of genders) {
      const vaccineIds = [...new Set(form.getAll(`vaccines_${gender}`).map(Number).filter((value) => Number.isInteger(value) && value > 0))];
      const packageId = Number(form.get(`package_${gender}`)) || null;
      if (vaccineIds.length === 0 && !packageId) continue;
      const [rule] = await tx.insert(schema.recommendationRules).values({ ageGroupId, gender, packageId }).returning({ id: schema.recommendationRules.id });
      if (vaccineIds.length) await tx.insert(schema.recommendationRuleVaccines).values(vaccineIds.map((vaccineId, index) => ({ ruleId: rule.id, vaccineId, sortOrder: index })));
    }
  });
  updateTag(TAGS.catalog);
  redirect("/admin/goi-y");
}
