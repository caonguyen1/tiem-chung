"use server";

import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { brandIcons } from "@/components/icons/brand-icons";
import { db, schema } from "@/db";
import { date, flag, FormError, type FormState, image, must, text } from "@/lib/admin/form";
import { moveRow, nextSortOrder, setVisible } from "@/lib/admin/mutations";
import { requireAdmin } from "@/lib/auth/session";
import { TAGS } from "@/lib/data/tags";

const banners = schema.banners;
const faqs = schema.faqs;
const PLACEMENTS = ["hero", "promo", "popup"] as const;

/** A link target: empty, an address on this site, a `#popup` action or an http(s) link. */
function target(form: FormData, name: string, label: string) {
  const value = text(form, name, 400);
  if (!value || value.startsWith("/") || value.startsWith("#") || /^https?:\/\//i.test(value)) return value;
  throw new FormError(`${label} phải bắt đầu bằng /, # hoặc http(s)://.`);
}

/** Banner of the homepage (admin module 10): slider, offer banner or welcome popup. */
export async function saveBanner(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const placement = text(form, "placement", 10) as (typeof PLACEMENTS)[number];
    if (!PLACEMENTS.includes(placement)) throw new FormError("Vui lòng chọn vị trí banner.");
    const imageDesktop = image(form, "imageDesktop");
    if (!imageDesktop) throw new FormError(placement === "popup" ? "Vui lòng chọn ảnh popup." : "Vui lòng chọn ảnh cho máy tính.");
    // The popup has one square picture for every screen.
    const imageMobile = placement === "popup" ? imageDesktop : image(form, "imageMobile");
    if (!imageMobile) throw new FormError("Vui lòng chọn ảnh cho điện thoại (bản mobile phải có đủ nội dung như bản máy tính).");

    const actions = [0, 1].flatMap((index) => {
      const label = text(form, `actionLabel${index}`, 40);
      const href = target(form, `actionHref${index}`, "Link nút");
      return label && href ? [{ label, href }] : [];
    });
    const startsAt = date(form, "startsAt");
    // An end date means the end of that day.
    const endDay = date(form, "endsAt");
    const endsAt = endDay ? new Date(endDay.getTime() + 24 * 60 * 60 * 1000 - 1) : null;
    if (startsAt && endsAt && endsAt <= startsAt) throw new FormError("Ngày kết thúc phải sau ngày bắt đầu.");

    const values = {
      placement,
      name: must(form, "name", "tên banner", 120),
      alt: must(form, "alt", "mô tả ảnh (alt)", 300),
      href: target(form, "href", "Link của banner"),
      imageDesktop,
      imageMobile,
      actions: placement === "hero" ? actions : [],
      startsAt,
      endsAt,
      isVisible: flag(form, "isVisible"),
    };
    if (id) await db.update(banners).set(values).where(eq(banners.id, id));
    else await db.insert(banners).values({ ...values, sortOrder: await nextSortOrder(banners) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.banners);
  redirect("/admin/banner");
}

export async function toggleBanner(form: FormData) {
  await requireAdmin();
  await setVisible(banners, TAGS.banners, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveBanner(form: FormData) {
  await requireAdmin();
  await moveRow(banners, TAGS.banners, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteBanner(form: FormData) {
  await requireAdmin();
  await db.delete(banners).where(eq(banners.id, Number(form.get("id"))));
  updateTag(TAGS.banners);
}

/** Frequently asked question (shown on /cau-hoi-thuong-gap; `showOnHome` ones also on the homepage). */
export async function saveFaq(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const id = Number(form.get("id")) || 0;
    const values = {
      question: must(form, "question", "câu hỏi", 300),
      answer: must(form, "answer", "câu trả lời", 3000),
      showOnHome: flag(form, "showOnHome"),
      isVisible: flag(form, "isVisible"),
    };
    if (id) await db.update(faqs).set(values).where(eq(faqs.id, id));
    else await db.insert(faqs).values({ ...values, sortOrder: await nextSortOrder(faqs) });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.faqs);
  redirect("/admin/banner/cau-hoi");
}

export async function toggleFaq(form: FormData) {
  await requireAdmin();
  await setVisible(faqs, TAGS.faqs, Number(form.get("id")), form.get("visible") === "on");
}

export async function moveFaq(form: FormData) {
  await requireAdmin();
  await moveRow(faqs, TAGS.faqs, Number(form.get("id")), form.get("direction") === "up" ? "up" : "down");
}

export async function deleteFaq(form: FormData) {
  await requireAdmin();
  await db.delete(faqs).where(eq(faqs.id, Number(form.get("id"))));
  updateTag(TAGS.faqs);
}

/** The four "Vì sao chọn Tâm Trí" items, kept in `site_settings`. */
export async function saveWhyChooseUs(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const items = [0, 1, 2, 3].map((index) => {
      const icon = text(form, `icon${index}`, 40);
      if (!(icon in brandIcons)) throw new FormError(`Mục ${index + 1}: vui lòng chọn biểu tượng.`);
      return { icon, title: must(form, `title${index}`, `tiêu đề mục ${index + 1}`, 60), text: must(form, `text${index}`, `mô tả mục ${index + 1}`, 200) };
    });
    await db
      .insert(schema.siteSettings)
      .values({ key: "whyChooseUs", value: items })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: items, updatedAt: sql`now()` } });
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  updateTag(TAGS.settings);
  redirect("/admin/banner/vi-sao-chon");
}
