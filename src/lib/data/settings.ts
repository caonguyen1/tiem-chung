import "server-only";

import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type { BrandIconName } from "@/components/icons/brand-icons";
import type { NavItem, SiteSettings } from "@/content/types";
import { db, schema } from "@/db";

import { TAGS } from "./tags";

type General = Pick<
  SiteSettings,
  "name" | "shortName" | "slogan" | "description" | "email" | "address" | "openingHours" | "hotline" | "phone" | "zaloUrl" | "facebookUrl" | "youtubeUrl"
>;
type Hotline = { hours: string; lines: SiteSettings["hotlineLines"] };
type FooterColumn = { title: string; menu: (typeof schema.menuName.enumValues)[number] };

export type WhyItem = { icon: BrandIconName; title: string; text: string };

async function readSettings() {
  const rows = await db.select().from(schema.siteSettings);
  return new Map(rows.map((row) => [row.key, row.value]));
}

/** Company info, hotline, social links and every menu (admin module 12). */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);

  const [settings, menuRows] = await Promise.all([
    readSettings(),
    db.select().from(schema.menuItems).where(eq(schema.menuItems.isVisible, true)).orderBy(asc(schema.menuItems.sortOrder)),
  ]);
  const menu = (name: FooterColumn["menu"]): NavItem[] =>
    menuRows.filter((row) => row.menu === name).map((row) => ({ label: row.label, href: row.href, ...(row.highlight && { highlight: true }) }));

  const general = settings.get("general") as General;
  const hotline = settings.get("hotline") as Hotline;
  const footerColumns = (settings.get("footerColumns") as FooterColumn[]) ?? [];

  return {
    ...general,
    mainMenu: menu("main"),
    secondaryMenu: menu("secondary"),
    policyMenu: menu("policy"),
    headerMenu: menu("header"),
    footerColumns: footerColumns.map((column) => ({ title: column.title, items: menu(column.menu) })),
    hotlineHours: hotline?.hours ?? "",
    hotlineLines: hotline?.lines ?? [],
    social: (settings.get("social") as SiteSettings["social"]) ?? [],
  };
}

/** "Vì sao chọn Tâm Trí" items (homepage block, admin module 10). */
export async function getWhyChooseUs(): Promise<WhyItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);

  const settings = await readSettings();
  return (settings.get("whyChooseUs") as WhyItem[]) ?? [];
}
