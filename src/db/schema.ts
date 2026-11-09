/*
 * Database schema for the 13 admin modules in docs/requirements/website-pages-and-features.pdf.
 * Every content table has visibility, sort order, SEO fields and timestamps, because the
 * spec gives every admin module list/search/filter, show/hide, ordering and SEO.
 * After editing: `pnpm db:generate` writes a migration, `pnpm db:migrate` applies it.
 */
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

const listing = {
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
};

const seo = {
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
};

export type NavLink = { label: string; href: string };
export type ContentSection = { key: string; title: string; body: string };
export type Faq = { question: string; answer: string };

/* ---------- 13. Admin accounts ---------- */

export const adminRole = pgEnum("admin_role", ["admin", "editor"]);

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  /** scrypt: "salt:hash", both hex. */
  passwordHash: text("password_hash").notNull(),
  role: adminRole("role").notNull().default("editor"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

export const adminSessions = pgTable("admin_sessions", {
  /** SHA-256 of the session token kept in the cookie. */
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------- 8. Medical team ---------- */

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  photo: text("photo"),
  quote: text("quote"),
  bio: text("bio"),
  experience: text("experience"),
  ...listing,
  ...seo,
  ...timestamps,
});

/* ---------- 2. Categories (filters) ---------- */

export const diseaseGroups = pgTable("disease_groups", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  /** Key of src/components/icons/brand-icons.tsx. */
  icon: text("icon").notNull(),
  bannerImage: text("banner_image"),
  /** Shown as a tile on the homepage. */
  featured: boolean("featured").notNull().default(false),
  ...listing,
  ...seo,
  ...timestamps,
});

/** Age ranges, used by the vaccine filter and by "Tôi nên tiêm gì?". */
export const ageGroups = pgTable("age_groups", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  ...listing,
  ...timestamps,
});

/* ---------- 1. Vaccines ---------- */

export const vaccineStatus = pgEnum("vaccine_status", ["book", "preorder", "consult"]);

export const vaccines = pgTable("vaccines", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** e.g. "Liều 0,5 ml". */
  unit: text("unit"),
  prevents: text("prevents").notNull(),
  origin: text("origin").notNull(),
  manufacturer: text("manufacturer").notNull(),
  audience: text("audience").notNull(),
  doseCount: integer("dose_count"),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  status: vaccineStatus("status").notNull().default("book"),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  /** Detail page sections in order: giới thiệu, thông tin bệnh lý, phác đồ, chống chỉ định... */
  content: jsonb("content").$type<ContentSection[]>().notNull().default([]),
  faqs: jsonb("faqs").$type<Faq[]>().notNull().default([]),
  reviewerId: integer("reviewer_id").references(() => doctors.id, { onDelete: "set null" }),
  ...listing,
  ...seo,
  ...timestamps,
});

export const vaccineDiseaseGroups = pgTable(
  "vaccine_disease_groups",
  {
    vaccineId: integer("vaccine_id")
      .notNull()
      .references(() => vaccines.id, { onDelete: "cascade" }),
    diseaseGroupId: integer("disease_group_id")
      .notNull()
      .references(() => diseaseGroups.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.vaccineId, table.diseaseGroupId] })],
);

export const vaccineAgeGroups = pgTable(
  "vaccine_age_groups",
  {
    vaccineId: integer("vaccine_id")
      .notNull()
      .references(() => vaccines.id, { onDelete: "cascade" }),
    ageGroupId: integer("age_group_id")
      .notNull()
      .references(() => ageGroups.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.vaccineId, table.ageGroupId] })],
);

/* ---------- 3. Vaccine packages ---------- */

export const packageKind = pgEnum("package_kind", ["age", "audience"]);

export const vaccinePackages = pgTable("vaccine_packages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: packageKind("kind").notNull(),
  audienceLabel: text("audience_label").notNull(),
  icon: text("icon").notNull(),
  image: text("image"),
  description: text("description"),
  /** Entered by the admin; the item list below gives the per-vaccine breakdown. */
  doseCount: integer("dose_count").notNull(),
  vaccineCount: integer("vaccine_count").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price").notNull(),
  /** Tag such as "Phổ biến nhất"; set = highlighted card. */
  highlight: text("highlight"),
  ...listing,
  ...seo,
  ...timestamps,
});

export const packageItems = pgTable(
  "package_items",
  {
    packageId: integer("package_id")
      .notNull()
      .references(() => vaccinePackages.id, { onDelete: "cascade" }),
    vaccineId: integer("vaccine_id")
      .notNull()
      .references(() => vaccines.id, { onDelete: "restrict" }),
    doses: integer("doses").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.packageId, table.vaccineId] })],
);

/* ---------- 4. "Tôi nên tiêm gì?" ---------- */

export const ruleGender = pgEnum("rule_gender", ["all", "nu", "nam"]);

export const recommendationRules = pgTable(
  "recommendation_rules",
  {
    id: serial("id").primaryKey(),
    ageGroupId: integer("age_group_id")
      .notNull()
      .references(() => ageGroups.id, { onDelete: "cascade" }),
    gender: ruleGender("gender").notNull().default("all"),
    packageId: integer("package_id").references(() => vaccinePackages.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [uniqueIndex("recommendation_rules_age_gender").on(table.ageGroupId, table.gender)],
);

export const recommendationRuleVaccines = pgTable(
  "recommendation_rule_vaccines",
  {
    ruleId: integer("rule_id")
      .notNull()
      .references(() => recommendationRules.id, { onDelete: "cascade" }),
    vaccineId: integer("vaccine_id")
      .notNull()
      .references(() => vaccines.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.ruleId, table.vaccineId] })],
);

/* ---------- 7. Centers ---------- */

export const centers = pgTable("centers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  /** Address before the 2025 merger of provinces and wards. */
  addressOld: text("address_old"),
  province: text("province").notNull(),
  ward: text("ward"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  openingHours: text("opening_hours").notNull(),
  phone: text("phone").notNull(),
  image: text("image"),
  mapUrl: text("map_url"),
  mapEmbedUrl: text("map_embed_url"),
  ...listing,
  ...seo,
  ...timestamps,
});

/* ---------- 5. Appointments, 6. Consult requests ---------- */

export const appointmentStatus = pgEnum("appointment_status", ["new", "confirmed", "done", "cancelled"]);

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    /** Slug of the chosen vaccine or package, empty when the visitor wants advice. */
    itemSlug: text("item_slug"),
    preferredDate: date("preferred_date"),
    centerId: integer("center_id").references(() => centers.id, { onDelete: "set null" }),
    note: text("note"),
    status: appointmentStatus("status").notNull().default("new"),
    staffNote: text("staff_note"),
    ...timestamps,
  },
  (table) => [index("appointments_status_date").on(table.status, table.preferredDate)],
);

export const consultStatus = pgEnum("consult_status", ["new", "in_progress", "done"]);

export const consultRequests = pgTable(
  "consult_requests",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    topic: text("topic"),
    note: text("note"),
    status: consultStatus("status").notNull().default("new"),
    staffNote: text("staff_note"),
    ...timestamps,
  },
  (table) => [index("consult_requests_status").on(table.status)],
);

/* ---------- 9. Articles (incl. promotions and outbreak alerts) ---------- */

export const articleCategories = pgTable("article_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** The "Khuyến mãi" category feeds the promotions pages. */
  isPromotion: boolean("is_promotion").notNull().default(false),
  ...listing,
  ...seo,
  ...timestamps,
});

export const alertLevel = pgEnum("alert_level", ["high", "watch"]);

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull().default(""),
    image: text("image"),
    categoryId: integer("category_id").references(() => articleCategories.id, { onDelete: "set null" }),
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    isFeatured: boolean("is_featured").notNull().default(false),
    /** Outbreak alert shown on the homepage (tag + teaser on the card). */
    isOutbreakAlert: boolean("is_outbreak_alert").notNull().default(false),
    alertLevel: alertLevel("alert_level"),
    /** Short headline on the alert card; falls back to the article title. */
    alertTitle: text("alert_title"),
    alertTag: text("alert_tag"),
    alertTeaser: text("alert_teaser"),
    reviewerId: integer("reviewer_id").references(() => doctors.id, { onDelete: "set null" }),
    ...listing,
    ...seo,
    ...timestamps,
  },
  (table) => [index("articles_published").on(table.publishedAt)],
);

/* ---------- 10. Banners & homepage ---------- */

export const bannerPlacement = pgEnum("banner_placement", ["hero", "promo", "popup"]);

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  placement: bannerPlacement("placement").notNull(),
  /** Internal name in the admin list. */
  name: text("name").notNull(),
  alt: text("alt").notNull(),
  href: text("href").notNull().default(""),
  imageDesktop: text("image_desktop").notNull(),
  imageMobile: text("image_mobile").notNull(),
  /** Real buttons laid over the artwork's empty corner. */
  actions: jsonb("actions").$type<NavLink[]>().notNull().default([]),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  ...listing,
  ...timestamps,
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  showOnHome: boolean("show_on_home").notNull().default(true),
  ...listing,
  ...timestamps,
});

/* ---------- 11. Policy pages ---------- */

export const policyPages = pgTable("policy_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  ...listing,
  ...seo,
  ...timestamps,
});

/* ---------- 12. Menus & general information ---------- */

/** Which menu an item belongs to; footer column titles live in site_settings. */
export const menuName = pgEnum("menu_name", ["header", "main", "secondary", "policy", "footer_services", "footer_about", "footer_policy"]);

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  menu: menuName("menu").notNull(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  highlight: boolean("highlight").notNull().default(false),
  ...listing,
  ...timestamps,
});

/** Key/value store for company info, hotline, social links, homepage blocks. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
