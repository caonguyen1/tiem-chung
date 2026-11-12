import "server-only";

import { eq, inArray } from "drizzle-orm";

import { db, schema } from "@/db";

/**
 * A package's dose count, vaccine count and original price are not typed in: they come from its
 * items (doses × each vaccine's single-shot price). Call this after items change, and after a
 * vaccine's price changes (pass its id; the packages that contain it are refreshed).
 */
export async function recomputePackages(only?: { packageId?: number; vaccineId?: number }) {
  let ids: number[] | undefined;
  if (only?.packageId) ids = [only.packageId];
  else if (only?.vaccineId) {
    const rows = await db.select({ id: schema.packageItems.packageId }).from(schema.packageItems).where(eq(schema.packageItems.vaccineId, only.vaccineId));
    ids = rows.map((row) => row.id);
    if (ids.length === 0) return;
  }

  const items = await db
    .select({ packageId: schema.packageItems.packageId, doses: schema.packageItems.doses, price: schema.vaccines.price })
    .from(schema.packageItems)
    .innerJoin(schema.vaccines, eq(schema.vaccines.id, schema.packageItems.vaccineId))
    .where(ids ? inArray(schema.packageItems.packageId, ids) : undefined);

  const totals = new Map<number, { doses: number; vaccines: number; original: number }>();
  for (const item of items) {
    const total = totals.get(item.packageId) ?? { doses: 0, vaccines: 0, original: 0 };
    total.doses += item.doses;
    total.vaccines += 1;
    total.original += item.doses * item.price;
    totals.set(item.packageId, total);
  }
  for (const packageId of ids ?? [...totals.keys()]) {
    const total = totals.get(packageId) ?? { doses: 0, vaccines: 0, original: 0 };
    await db.update(schema.vaccinePackages).set({ doseCount: total.doses, vaccineCount: total.vaccines, originalPrice: total.original }).where(eq(schema.vaccinePackages.id, packageId));
  }
}
