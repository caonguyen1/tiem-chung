import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type { BrandIconName } from "@/components/icons/brand-icons";
import type { DiseaseGroup, PackageDetail, Vaccine, VaccineDetail, VaccinePackage } from "@/content/types";
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

  const [rows, links, ageLinks] = await Promise.all([
    db.select().from(schema.vaccines).where(eq(schema.vaccines.isVisible, true)).orderBy(asc(schema.vaccines.sortOrder)),
    db
      .select({ vaccineId: schema.vaccineDiseaseGroups.vaccineId, slug: schema.diseaseGroups.slug })
      .from(schema.vaccineDiseaseGroups)
      .innerJoin(schema.diseaseGroups, eq(schema.diseaseGroups.id, schema.vaccineDiseaseGroups.diseaseGroupId)),
    db
      .select({ vaccineId: schema.vaccineAgeGroups.vaccineId, slug: schema.ageGroups.slug })
      .from(schema.vaccineAgeGroups)
      .innerJoin(schema.ageGroups, eq(schema.ageGroups.id, schema.vaccineAgeGroups.ageGroupId)),
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
    ageSlugs: ageLinks.filter((link) => link.vaccineId === row.id).map((link) => link.slug),
    ...(row.doseCount && { doseCount: row.doseCount }),
  }));
}

/** One vaccine with its detail content, or null when the slug is unknown or hidden. */
export async function getVaccineDetail(slug: string): Promise<VaccineDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const [row] = await db
    .select({
      vaccine: schema.vaccines,
      reviewerSlug: schema.doctors.slug,
      reviewerTitle: schema.doctors.title,
      reviewerName: schema.doctors.name,
      reviewerSpecialty: schema.doctors.specialty,
    })
    .from(schema.vaccines)
    .leftJoin(schema.doctors, eq(schema.doctors.id, schema.vaccines.reviewerId))
    .where(and(eq(schema.vaccines.slug, slug), eq(schema.vaccines.isVisible, true)));
  if (!row) return null;
  const vaccine = row.vaccine;

  const groups = await db
    .select({ slug: schema.diseaseGroups.slug, name: schema.diseaseGroups.name })
    .from(schema.vaccineDiseaseGroups)
    .innerJoin(schema.diseaseGroups, eq(schema.diseaseGroups.id, schema.vaccineDiseaseGroups.diseaseGroupId))
    .where(eq(schema.vaccineDiseaseGroups.vaccineId, vaccine.id));

  return {
    slug: vaccine.slug,
    name: vaccine.name,
    diseaseSlugs: groups.map((group) => group.slug),
    prevents: vaccine.prevents,
    origin: vaccine.origin,
    manufacturer: vaccine.manufacturer,
    audience: vaccine.audience,
    price: vaccine.price,
    status: vaccine.status,
    ...(vaccine.doseCount && { doseCount: vaccine.doseCount }),
    ...(vaccine.unit && { unit: vaccine.unit }),
    ...(vaccine.originalPrice && { originalPrice: vaccine.originalPrice }),
    gallery: vaccine.gallery,
    sections: vaccine.content,
    faqs: vaccine.faqs,
    groups,
    ...(row.reviewerSlug && {
      reviewer: { slug: row.reviewerSlug, label: `${row.reviewerTitle} ${row.reviewerName}`, specialty: row.reviewerSpecialty ?? "" },
    }),
  };
}

/** A package with the doses inside it, or null when the slug is unknown or hidden. */
export async function getPackageDetail(slug: string): Promise<PackageDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const [row] = await db
    .select()
    .from(schema.vaccinePackages)
    .where(and(eq(schema.vaccinePackages.slug, slug), eq(schema.vaccinePackages.isVisible, true)));
  if (!row) return null;
  const items = await db
    .select({ vaccine: schema.vaccines, doses: schema.packageItems.doses })
    .from(schema.packageItems)
    .innerJoin(schema.vaccines, eq(schema.vaccines.id, schema.packageItems.vaccineId))
    .where(eq(schema.packageItems.packageId, row.id))
    .orderBy(asc(schema.packageItems.sortOrder));
  return {
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
    ...(row.description && { description: row.description }),
    items: items.map((item) => ({
      slug: item.vaccine.slug,
      name: item.vaccine.name,
      origin: item.vaccine.origin,
      prevents: item.vaccine.prevents,
      price: item.vaccine.price,
      doses: item.doses,
    })),
  };
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
