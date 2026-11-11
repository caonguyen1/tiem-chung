import type { MetadataRoute } from "next";

import { getDiseaseGroups, getPackages, getVaccines } from "@/lib/data/catalog";
import { getArticleCategories, getArticles, getCenters, getDoctors, getOutbreakAlerts, getPolicyPages, getPromotions } from "@/lib/data/content";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3210";

const staticPaths = [
  "/",
  "/vac-xin",
  "/goi-vac-xin",
  "/khuyen-mai",
  "/toi-nen-tiem-gi",
  "/dat-hen",
  "/gioi-thieu",
  "/doi-ngu-chuyen-mon",
  "/he-thong-trung-tam",
  "/kien-thuc",
  "/cau-hoi-thuong-gap",
  "/bang-gia",
];

/** Every public address, with the slugs read from the database. Listed in robots.txt once SITE_INDEXABLE=1. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [groups, vaccines, packages, promotions, doctors, centers, articles, alerts, categories, policies] = await Promise.all([
    getDiseaseGroups(),
    getVaccines(),
    getPackages(),
    getPromotions(),
    getDoctors(),
    getCenters(),
    getArticles(500),
    getOutbreakAlerts(),
    getArticleCategories(),
    getPolicyPages(),
  ]);
  const paths = [
    ...staticPaths,
    ...groups.map((item) => `/vac-xin/nhom-benh/${item.slug}`),
    ...vaccines.map((item) => `/vac-xin/${item.slug}`),
    ...packages.map((item) => `/goi-vac-xin/${item.slug}`),
    ...promotions.map((item) => `/khuyen-mai/${item.slug}`),
    ...doctors.map((item) => `/doi-ngu-chuyen-mon/${item.slug}`),
    ...centers.map((item) => `/he-thong-trung-tam/${item.slug}`),
    ...categories.map((item) => `/kien-thuc/${item.slug}`),
    ...articles.map((item) => `/kien-thuc/bai-viet/${item.slug}`),
    ...alerts.map((item) => `/kien-thuc/bai-viet/${item.id}`),
    ...policies.map((item) => `/chinh-sach/${item.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
