import type { BrandIconName } from "@/components/icons/brand-icons";

/*
 * Shapes of the content the admin will manage (docs/requirements, admin modules
 * 1–12). Pages read these through src/content/*; when the CMS lands, only the
 * loaders change, not the components.
 */

export type NavItem = { label: string; href: string; /** Shown in the accent colour (e.g. "Khuyến mãi"). */ highlight?: boolean };

export type SiteSettings = {
  name: string;
  shortName: string;
  slogan: string;
  description: string;
  hotline: { display: string; dial: string; note: string };
  phone: { display: string; dial: string };
  email: string;
  address: string;
  openingHours: string;
  zaloUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  mainMenu: NavItem[];
  secondaryMenu: NavItem[];
  policyMenu: NavItem[];
  /** Layout C header menu (short labels so it fits one row). */
  headerMenu: NavItem[];
  footerColumns: { title: string; items: NavItem[] }[];
  /** Switchboard hours and its branches, shown in the contact card and footer. */
  hotlineHours: string;
  hotlineLines: { label: string; value: string; dial: string }[];
  /** Empty href = account not set up yet; the icon shows but is not clickable. */
  social: { network: "facebook" | "zalo" | "tiktok" | "youtube"; label: string; href: string }[];
};

/** Homepage welcome popup (admin module "Banner & trang chủ"): one square image. */
export type WelcomePopup = {
  enabled: boolean;
  image: string;
  alt: string;
  href: string;
};

/**
 * A finished banner artwork (admin module "Banner & trang chủ"): one image for
 * desktop (1920×560) and one for mobile (1080×1080), plus where it links to.
 */
export type HeroBanner = {
  id: string;
  /** Read by screen readers and search engines; the artwork carries the visible text. */
  alt: string;
  href: string;
  imageDesktop: string;
  imageMobile: string;
  /**
   * Real buttons laid over the artwork's empty bottom-left corner. Only for
   * artwork drawn without baked-in buttons (scripts/banners/00-gioi-thieu.html).
   */
  actions?: NavItem[];
};

export type OutbreakAlert = {
  id: string;
  level: "high" | "watch";
  /** Short label on the card, e.g. "Đang vào mùa". */
  tag: string;
  /** One line under the title on the card. */
  teaser: string;
  title: string;
  summary: string;
  href: string;
};

export type DiseaseGroup = {
  slug: string;
  name: string;
  shortName: string;
  icon: BrandIconName;
  featured: boolean;
};

export type VaccineStatus = "book" | "preorder" | "consult";

export type Vaccine = {
  slug: string;
  name: string;
  diseaseSlugs: string[];
  prevents: string;
  origin: string;
  manufacturer: string;
  audience: string;
  price: number;
  status: VaccineStatus;
  /** Age ranges (slugs of the age groups) this vaccine can be given in; used by the list filter. */
  ageSlugs?: string[];
  /** Doses in a full course; used by the list filter. */
  doseCount?: number;
};

export type ContentSection = { key: string; title: string; body: string };
export type Faq = { question: string; answer: string };

/** Everything the vaccine detail page shows (admin module 1). */
export type VaccineDetail = Vaccine & {
  unit?: string;
  originalPrice?: number;
  gallery: string[];
  sections: ContentSection[];
  faqs: Faq[];
  reviewer?: { slug: string; label: string; specialty: string };
  groups: { slug: string; name: string }[];
};

export type VaccinePackage = {
  slug: string;
  name: string;
  kind: "age" | "audience";
  audienceLabel: string;
  icon: BrandIconName;
  doses: number;
  vaccineCount: number;
  price: number;
  originalPrice: number;
  highlight?: string;
};

export type PackageItem = { slug: string; name: string; origin: string; doses: number; price: number; prevents: string };

/** Package detail page: the doses inside the package (admin module 3). */
export type PackageDetail = VaccinePackage & { description?: string; items: PackageItem[] };

export type Doctor = {
  slug: string;
  title: string;
  name: string;
  specialty: string;
  photo?: string;
  quote?: string;
  /** Detail page only. */
  bio?: string;
  experience?: string;
};

export type ArticleCategory = { slug: string; name: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  image: string;
  views: number;
  publishedAt: string;
  reviewedBy?: string;
};

export type ArticleDetail = Article & { body: string; categoryName: string; reviewer?: { slug: string; label: string } };

export type PolicyPage = { slug: string; title: string; body: string };

/** "Giới thiệu" page blocks (admin module 12, general information). */
export type AboutContent = {
  intro: string;
  story: string[];
  values: { icon: BrandIconName; title: string; text: string }[];
  numbers: { value: string; label: string }[];
};

export type Center = {
  slug: string;
  name: string;
  address: string;
  province: string;
  openingHours: string;
  phone: string;
  image: string;
  mapUrl: string;
  /**
   * The "Embed a map" URL from the center's own Google Maps listing. Left empty
   * until the listing exists: a plain address search pins whatever business
   * Google already knows at that address (a café, for 424 Nguyễn Thị Minh Khai).
   */
  mapEmbedUrl?: string;
  /** Address before the 2025 merger of provinces and wards. */
  addressOld?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
};
