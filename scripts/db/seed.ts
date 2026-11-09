/*
 * Fills the database with the sample content in src/content/*.ts (the same data the
 * site showed before the database existed) and creates the first admin account from
 * ADMIN_EMAIL / ADMIN_PASSWORD. Wipes every table first, so only use it on a fresh or
 * throwaway database. Run: `pnpm db:seed` (or `pnpm db:reset` to also start and migrate).
 */
import { randomBytes, scryptSync } from "node:crypto";

import { getTableName, is, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { diseaseGroups, vaccinePackages, vaccines } from "../../src/content/catalog";
import { articleCategories, articles, centers, doctors } from "../../src/content/editorial";
import { ageRanges, genders, rules } from "../../src/content/recommendations";
import { faqs, homeBanners, outbreakAlerts, promoBanner, siteSettings, welcomePopup, whyChooseUs } from "../../src/content/site";
import * as schema from "../../src/db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set (see .env.example).");

const client = postgres(url, { max: 1, onnotice: () => {} });
const db = drizzle(client, { schema });

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  await db.transaction(async (tx) => {
    const tables = (Object.values(schema) as unknown[])
      .filter((value): value is PgTable => is(value, PgTable))
      .map((table) => `"${getTableName(table)}"`);
    await tx.execute(sql.raw(`TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE`));

    // Admin account
    const email = process.env.ADMIN_EMAIL ?? "admin@tamtri.local";
    const password = process.env.ADMIN_PASSWORD ?? "change-me-please";
    await tx.insert(schema.adminUsers).values({ email, name: "Quản trị viên", passwordHash: hashPassword(password), role: "admin" });

    // Doctors
    const doctorRows = await tx
      .insert(schema.doctors)
      .values(doctors.map((doctor, index) => ({ ...doctor, sortOrder: index })))
      .returning({ id: schema.doctors.id, name: schema.doctors.name, title: schema.doctors.title });
    const doctorByLabel = new Map(doctorRows.map((row) => [`${row.title} ${row.name}`, row.id]));

    // Categories
    const groupRows = await tx
      .insert(schema.diseaseGroups)
      .values(diseaseGroups.map((group, index) => ({ ...group, sortOrder: index })))
      .returning({ id: schema.diseaseGroups.id, slug: schema.diseaseGroups.slug });
    const groupId = new Map(groupRows.map((row) => [row.slug, row.id]));

    const ageRows = await tx
      .insert(schema.ageGroups)
      .values(ageRanges.map((range, index) => ({ slug: range.value, label: range.label, sortOrder: index })))
      .returning({ id: schema.ageGroups.id, slug: schema.ageGroups.slug });
    const ageId = new Map(ageRows.map((row) => [row.slug, row.id]));

    // Vaccines
    const vaccineRows = await tx
      .insert(schema.vaccines)
      .values(
        vaccines.map((vaccine, index) => ({
          slug: vaccine.slug,
          name: vaccine.name,
          prevents: vaccine.prevents,
          origin: vaccine.origin,
          manufacturer: vaccine.manufacturer,
          audience: vaccine.audience,
          price: vaccine.price,
          status: vaccine.status,
          sortOrder: index,
        })),
      )
      .returning({ id: schema.vaccines.id, slug: schema.vaccines.slug });
    const vaccineId = new Map(vaccineRows.map((row) => [row.slug, row.id]));
    await tx.insert(schema.vaccineDiseaseGroups).values(
      vaccines.flatMap((vaccine) =>
        vaccine.diseaseSlugs.map((slug) => ({ vaccineId: vaccineId.get(vaccine.slug)!, diseaseGroupId: groupId.get(slug)! })),
      ),
    );

    // Packages
    const packageRows = await tx
      .insert(schema.vaccinePackages)
      .values(
        vaccinePackages.map((pkg, index) => ({
          slug: pkg.slug,
          name: pkg.name,
          kind: pkg.kind,
          audienceLabel: pkg.audienceLabel,
          icon: pkg.icon,
          doseCount: pkg.doses,
          vaccineCount: pkg.vaccineCount,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          highlight: pkg.highlight ?? null,
          sortOrder: index,
        })),
      )
      .returning({ id: schema.vaccinePackages.id, slug: schema.vaccinePackages.slug });
    const packageId = new Map(packageRows.map((row) => [row.slug, row.id]));

    // "Tôi nên tiêm gì?" rules: one row per age range and gender ("all" when both match).
    for (const range of ageRanges) {
      const byGender = rules[range.value] ?? {};
      const entries = byGender.all ? [["all", byGender.all] as const] : genders.flatMap((gender) => (byGender[gender.value] ? [[gender.value, byGender[gender.value]!] as const] : []));
      for (const [gender, rule] of entries) {
        const [row] = await tx
          .insert(schema.recommendationRules)
          .values({ ageGroupId: ageId.get(range.value)!, gender, packageId: packageId.get(rule.packageSlug) ?? null })
          .returning({ id: schema.recommendationRules.id });
        const picks = rule.vaccineSlugs.filter((slug) => vaccineId.has(slug));
        if (picks.length) {
          await tx.insert(schema.recommendationRuleVaccines).values(picks.map((slug, index) => ({ ruleId: row.id, vaccineId: vaccineId.get(slug)!, sortOrder: index })));
        }
      }
    }

    // Centers
    await tx.insert(schema.centers).values(centers.map((center, index) => ({ ...center, sortOrder: index })));

    // Articles, then outbreak alerts (an alert points at an existing article or gets its own).
    const categoryRows = await tx
      .insert(schema.articleCategories)
      .values(articleCategories.map((category, index) => ({ ...category, sortOrder: index })))
      .returning({ id: schema.articleCategories.id, slug: schema.articleCategories.slug });
    const categoryId = new Map(categoryRows.map((row) => [row.slug, row.id]));
    await tx.insert(schema.articles).values(
      articles.map((article, index) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        image: article.image,
        categoryId: categoryId.get(article.categorySlug) ?? null,
        views: article.views,
        publishedAt: new Date(article.publishedAt),
        isFeatured: index === 0,
        reviewerId: article.reviewedBy ? (doctorByLabel.get(article.reviewedBy) ?? null) : null,
        sortOrder: index,
      })),
    );
    for (const [index, alert] of outbreakAlerts.entries()) {
      const slug = alert.href.split("/").pop()!;
      const alertFields = { isOutbreakAlert: true, alertLevel: alert.level, alertTitle: alert.title, alertTag: alert.tag, alertTeaser: alert.teaser, sortOrder: index };
      const updated = await tx.update(schema.articles).set(alertFields).where(sql`${schema.articles.slug} = ${slug}`).returning({ id: schema.articles.id });
      if (updated.length === 0) {
        await tx.insert(schema.articles).values({
          slug,
          title: alert.title,
          excerpt: alert.summary,
          categoryId: categoryId.get("cham-soc-suc-khoe") ?? null,
          publishedAt: new Date(),
          ...alertFields,
        });
      }
    }

    // Banners
    await tx.insert(schema.banners).values([
      ...homeBanners.map((banner, index) => ({
        placement: "hero" as const,
        name: banner.id,
        alt: banner.alt,
        href: banner.href,
        imageDesktop: banner.imageDesktop,
        imageMobile: banner.imageMobile,
        actions: banner.actions ?? [],
        sortOrder: index,
      })),
      { placement: "promo" as const, name: promoBanner.id, alt: promoBanner.alt, href: promoBanner.href, imageDesktop: promoBanner.imageDesktop, imageMobile: promoBanner.imageMobile },
      {
        placement: "popup" as const,
        name: "chao-mung",
        alt: welcomePopup.alt,
        href: welcomePopup.href,
        imageDesktop: welcomePopup.image,
        imageMobile: welcomePopup.image,
        isVisible: welcomePopup.enabled,
      },
    ]);

    await tx.insert(schema.faqs).values(faqs.map((faq, index) => ({ ...faq, sortOrder: index })));

    // Menus
    const footerMenus = ["footer_services", "footer_about", "footer_policy"] as const;
    const menuRows = [
      ...siteSettings.headerMenu.map((item) => ({ menu: "header" as const, ...item })),
      ...siteSettings.mainMenu.map((item) => ({ menu: "main" as const, ...item })),
      ...siteSettings.secondaryMenu.map((item) => ({ menu: "secondary" as const, ...item })),
      ...siteSettings.policyMenu.map((item) => ({ menu: "policy" as const, ...item })),
      ...siteSettings.footerColumns.flatMap((column, columnIndex) => column.items.map((item) => ({ menu: footerMenus[columnIndex], ...item }))),
    ];
    await tx.insert(schema.menuItems).values(menuRows.map((item, index) => ({ ...item, highlight: item.highlight ?? false, sortOrder: index })));

    // General information
    const { name, shortName, slogan, description, hotline, phone, email: contactEmail, address, openingHours, zaloUrl, facebookUrl, youtubeUrl } = siteSettings;
    await tx.insert(schema.siteSettings).values([
      { key: "general", value: { name, shortName, slogan, description, email: contactEmail, address, openingHours, hotline, phone, zaloUrl, facebookUrl, youtubeUrl } },
      { key: "hotline", value: { hours: siteSettings.hotlineHours, lines: siteSettings.hotlineLines } },
      { key: "social", value: siteSettings.social },
      { key: "footerColumns", value: siteSettings.footerColumns.map((column, index) => ({ title: column.title, menu: footerMenus[index] })) },
      { key: "whyChooseUs", value: whyChooseUs },
    ]);
  });

  const counts = await client`
    SELECT (SELECT count(*) FROM vaccines) AS vaccines, (SELECT count(*) FROM vaccine_packages) AS packages,
           (SELECT count(*) FROM articles) AS articles, (SELECT count(*) FROM banners) AS banners,
           (SELECT count(*) FROM recommendation_rules) AS rules, (SELECT count(*) FROM menu_items) AS menu_items`;
  console.log("Seeded:", counts[0]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
