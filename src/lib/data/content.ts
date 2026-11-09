import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type { Article, ArticleCategory, Center, HeroBanner, OutbreakAlert, WelcomePopup } from "@/content/types";
import { db, schema } from "@/db";

import { TAGS } from "./tags";

/** Latest visible articles, newest first (admin module 9). */
export async function getArticles(limit = 20): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const rows = await db
    .select({ article: schema.articles, categorySlug: schema.articleCategories.slug, reviewerTitle: schema.doctors.title, reviewerName: schema.doctors.name })
    .from(schema.articles)
    .leftJoin(schema.articleCategories, eq(schema.articleCategories.id, schema.articles.categoryId))
    .leftJoin(schema.doctors, eq(schema.doctors.id, schema.articles.reviewerId))
    .where(and(eq(schema.articles.isVisible, true), eq(schema.articles.isOutbreakAlert, false)))
    .orderBy(desc(schema.articles.isFeatured), asc(schema.articles.sortOrder), desc(schema.articles.publishedAt))
    .limit(limit);
  return rows.map(({ article, categorySlug, reviewerTitle, reviewerName }) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    categorySlug: categorySlug ?? "",
    image: article.image ?? "",
    views: article.views,
    publishedAt: (article.publishedAt ?? article.createdAt).toISOString().slice(0, 10),
    ...(reviewerName && { reviewedBy: `${reviewerTitle} ${reviewerName}` }),
  }));
}

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const rows = await db.select().from(schema.articleCategories).where(eq(schema.articleCategories.isVisible, true)).orderBy(asc(schema.articleCategories.sortOrder));
  return rows.map((row) => ({ slug: row.slug, name: row.name }));
}

/** Articles flagged as outbreak alerts, in admin order. */
export async function getOutbreakAlerts(): Promise<OutbreakAlert[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const rows = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.isVisible, true), eq(schema.articles.isOutbreakAlert, true)))
    .orderBy(asc(schema.articles.sortOrder));
  return rows.map((row) => ({
    id: row.slug,
    level: row.alertLevel ?? "watch",
    tag: row.alertTag ?? "",
    teaser: row.alertTeaser ?? "",
    title: row.alertTitle ?? row.title,
    summary: row.excerpt,
    href: `/kien-thuc/bai-viet/${row.slug}`,
  }));
}

/** Banners for one placement that are visible and inside their schedule (admin module 10). */
export async function getBanners(placement: "hero" | "promo"): Promise<HeroBanner[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.banners);

  const rows = await db
    .select()
    .from(schema.banners)
    .where(and(eq(schema.banners.placement, placement), eq(schema.banners.isVisible, true)))
    .orderBy(asc(schema.banners.sortOrder));
  return rows.filter(isLive).map((row) => ({
    id: String(row.id),
    alt: row.alt,
    href: row.href,
    imageDesktop: row.imageDesktop,
    imageMobile: row.imageMobile,
    ...(row.actions.length > 0 && { actions: row.actions }),
  }));
}

export async function getWelcomePopup(): Promise<WelcomePopup | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.banners);

  const rows = await db
    .select()
    .from(schema.banners)
    .where(and(eq(schema.banners.placement, "popup"), eq(schema.banners.isVisible, true)))
    .orderBy(asc(schema.banners.sortOrder));
  const popup = rows.find(isLive);
  return popup ? { enabled: true, image: popup.imageDesktop, alt: popup.alt, href: popup.href } : null;
}

// Schedules are checked when the cached list is built, so a banner starting mid-hour shows
// within the cache lifetime ("hours").
function isLive(row: { startsAt: Date | null; endsAt: Date | null }) {
  const now = Date.now();
  return (!row.startsAt || row.startsAt.getTime() <= now) && (!row.endsAt || row.endsAt.getTime() > now);
}

export async function getFaqs({ homeOnly = false } = {}): Promise<{ question: string; answer: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.faqs);

  const rows = await db
    .select({ question: schema.faqs.question, answer: schema.faqs.answer })
    .from(schema.faqs)
    .where(homeOnly ? and(eq(schema.faqs.isVisible, true), eq(schema.faqs.showOnHome, true)) : eq(schema.faqs.isVisible, true))
    .orderBy(asc(schema.faqs.sortOrder));
  return rows;
}

/** Visible centers (admin module 7). */
export async function getCenters(): Promise<Center[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.centers);

  const rows = await db.select().from(schema.centers).where(eq(schema.centers.isVisible, true)).orderBy(asc(schema.centers.sortOrder));
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    address: row.address,
    province: row.province,
    openingHours: row.openingHours,
    phone: row.phone,
    image: row.image ?? "",
    mapUrl: row.mapUrl ?? "",
    ...(row.mapEmbedUrl && { mapEmbedUrl: row.mapEmbedUrl }),
  }));
}
