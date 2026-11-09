import "server-only";

import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type { BrandIconName } from "@/components/icons/brand-icons";
import type { DiseaseGroup, Vaccine, VaccinePackage } from "@/content/types";
import { db, schema } from "@/db";

import { TAGS } from "./tags";

export type AgeGroup = { value: string; label: string };
export type Gender = "nu" | "nam";
/** Suggestions per age range and gender ("all" applies to both). */
export type RecommendationRules = Record<string, Partial<Record<Gender | "all", { vaccineSlugs: string[]; packageSlug: string }>>>;

/** Disease groups (admin module 2), in admin order. */
export async function getDiseaseGroups(): Promise<DiseaseGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const rows = await db.select().from(schema.diseaseGroups).where(eq(schema.diseaseGroups.isVisible, true)).orderBy(asc(schema.diseaseGroups.sortOrder));
  return rows.map((row) => ({ slug: row.slug, name: row.name, shortName: row.shortName, icon: row.icon as BrandIconName, featured: row.featured }));
}

/** Visible vaccines with the disease groups they prevent (admin module 1). */
export async function getVaccines(): Promise<Vaccine[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const [rows, links] = await Promise.all([
    db.select().from(schema.vaccines).where(eq(schema.vaccines.isVisible, true)).orderBy(asc(schema.vaccines.sortOrder)),
    db
      .select({ vaccineId: schema.vaccineDiseaseGroups.vaccineId, slug: schema.diseaseGroups.slug })
      .from(schema.vaccineDiseaseGroups)
      .innerJoin(schema.diseaseGroups, eq(schema.diseaseGroups.id, schema.vaccineDiseaseGroups.diseaseGroupId)),
  ]);
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    diseaseSlugs: links.filter((link) => link.vaccineId === row.id).map((link) => link.slug),
    prevents: row.prevents,
    origin: row.origin,
    manufacturer: row.manufacturer,
    audience: row.audience,
    price: row.price,
    status: row.status,
  }));
}

/** Visible vaccine packages (admin module 3). */
export async function getPackages(): Promise<VaccinePackage[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const rows = await db.select().from(schema.vaccinePackages).where(eq(schema.vaccinePackages.isVisible, true)).orderBy(asc(schema.vaccinePackages.sortOrder));
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    kind: row.kind,
    audienceLabel: row.audienceLabel,
    icon: row.icon as BrandIconName,
    doses: row.doseCount,
    vaccineCount: row.vaccineCount,
    price: row.price,
    originalPrice: row.originalPrice,
    ...(row.highlight && { highlight: row.highlight }),
  }));
}

/** Age ranges used by "Tôi nên tiêm gì?" and the vaccine filter. */
export async function getAgeGroups(): Promise<AgeGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const rows = await db.select().from(schema.ageGroups).where(eq(schema.ageGroups.isVisible, true)).orderBy(asc(schema.ageGroups.sortOrder));
  return rows.map((row) => ({ value: row.slug, label: row.label }));
}

/** "Tôi nên tiêm gì?" rules (admin module 4). */
export async function getRecommendationRules(): Promise<RecommendationRules> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const [rules, picks] = await Promise.all([
    db
      .select({ id: schema.recommendationRules.id, age: schema.ageGroups.slug, gender: schema.recommendationRules.gender, packageSlug: schema.vaccinePackages.slug })
      .from(schema.recommendationRules)
      .innerJoin(schema.ageGroups, eq(schema.ageGroups.id, schema.recommendationRules.ageGroupId))
      .leftJoin(schema.vaccinePackages, eq(schema.vaccinePackages.id, schema.recommendationRules.packageId)),
    db
      .select({ ruleId: schema.recommendationRuleVaccines.ruleId, slug: schema.vaccines.slug })
      .from(schema.recommendationRuleVaccines)
      .innerJoin(schema.vaccines, eq(schema.vaccines.id, schema.recommendationRuleVaccines.vaccineId))
      .orderBy(asc(schema.recommendationRuleVaccines.sortOrder)),
  ]);

  const result: RecommendationRules = {};
  for (const rule of rules) {
    result[rule.age] ??= {};
    result[rule.age][rule.gender] = {
      vaccineSlugs: picks.filter((pick) => pick.ruleId === rule.id).map((pick) => pick.slug),
      packageSlug: rule.packageSlug ?? "",
    };
  }
  return result;
}
