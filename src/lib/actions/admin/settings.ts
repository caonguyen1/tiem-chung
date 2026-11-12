"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { FormError, type FormState, must, optional, text, url } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

async function readSetting<T>(key: string, fallback: T): Promise<T> {
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key));
  return (row?.value as T | undefined) ?? fallback;
}

async function writeSetting(key: string, value: unknown) {
  await db.insert(schema.siteSettings).values({ key, value }).onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: sql`now()` } });
}

/** Phone number as typed → digits for a `tel:` link ("0593 888 666" → "0593888666"). */
const dial = (value: string) => value.replace(/[^0-9+*#]/g, "");

/** Company information (admin module 12): name, slogan, contact, opening hours. */
export async function saveGeneral(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const current = await readSetting<Record<string, unknown>>("general", {});
    const hotlineDisplay = must(form, "hotlineDisplay", "số tổng đài", 40);
    const phoneDisplay = must(form, "phoneDisplay", "số điện thoại", 40);
    await writeSetting("general", {
      ...current,
      name: must(form, "name", "tên trung tâm", 120),
      shortName: must(form, "shortName", "tên ngắn", 60),
      slogan: must(form, "slogan", "slogan", 120),
      description: must(form, "description", "mô tả website", 400),
      email: optional(form, "email", 120) ?? "",
      address: must(form, "address", "địa chỉ", 300),
      openingHours: must(form, "openingHours", "giờ mở cửa", 120),
      hotline: { display: hotlineDisplay, dial: dial(hotlineDisplay), note: text(form, "hotlineNote", 120) },
      phone: { display: phoneDisplay, dial: dial(phoneDisplay) },
    });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.settings);
  redirect("/admin/cai-dat");
}

/** Hotline branches and social links. Lines are typed as "Nhãn | Số hiển thị | Số quay", one per line. */
export async function saveHotline(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const lines = text(form, "lines", 2000)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [label, value, dialValue] = line.split("|").map((part) => part.trim());
        if (!label || !value) throw new FormError(`Dòng ${index + 1}: cần “Nhãn | Số hiển thị”.`);
        return { label, value, dial: dial(dialValue || value) };
      });
    const social = (["facebook", "zalo", "tiktok", "youtube"] as const).map((network) => ({
      network,
      label: { facebook: "Facebook", zalo: "Zalo", tiktok: "TikTok", youtube: "YouTube" }[network],
      href: url(form, network, "Link mạng xã hội") ?? "",
    }));
    await writeSetting("hotline", { hours: must(form, "hours", "giờ làm việc của tổng đài", 120), lines });
    await writeSetting("social", social);
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.settings);
  redirect("/admin/cai-dat/tong-dai");
}

const MENUS = ["header", "footer_services", "footer_about", "footer_policy"] as const;

/** Header and footer menus. Each menu is typed as "Nhãn | /đường-dẫn", one item per line. */
export async function saveMenus(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const rows = MENUS.flatMap((menu) =>
      text(form, menu, 4000)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const [label, href] = line.split("|").map((part) => part.trim());
          if (!label || !href) throw new FormError(`Menu ${menu}, dòng ${index + 1}: cần “Nhãn | đường dẫn”.`);
          if (!(href.startsWith("/") || href.startsWith("#") || /^https?:\/\//i.test(href))) throw new FormError(`Dòng “${label}”: đường dẫn phải bắt đầu bằng /, # hoặc http(s)://.`);
          return { menu, label, href, highlight: false, sortOrder: index };
        }),
    );
    const titles = ["footer_services", "footer_about", "footer_policy"].map((menu, index) => ({ title: must(form, `title${index}`, `tiêu đề cột ${index + 1}`, 60), menu }));
    await db.transaction(async (tx) => {
      await tx.delete(schema.menuItems).where(inArray(schema.menuItems.menu, [...MENUS]));
      if (rows.length) await tx.insert(schema.menuItems).values(rows);
    });
    await writeSetting("footerColumns", titles);
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.settings);
  redirect("/admin/cai-dat/menu");
}
