"use server";

import { eq } from "drizzle-orm";

import { db, schema } from "@/db";

export type SubmitResult = { ok: true } | { ok: false; error: string };

const PHONE = /^[0-9+*().\s-]{8,20}$/;

function field(form: FormData, name: string, max = 200) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function contact(form: FormData) {
  const fullName = field(form, "name", 120);
  const phone = field(form, "phone", 20);
  if (!fullName) return { error: "Vui lòng nhập họ và tên." } as const;
  if (!PHONE.test(phone)) return { error: "Số điện thoại chưa đúng." } as const;
  return { fullName, phone } as const;
}

/** "Đặt lịch tiêm" popup → appointments (admin module 5). */
export async function submitAppointment(form: FormData): Promise<SubmitResult> {
  const person = contact(form);
  if ("error" in person) return { ok: false, error: person.error! };

  const date = field(form, "date", 10);
  const centerSlug = field(form, "center", 80);
  try {
    const [center] = centerSlug ? await db.select({ id: schema.centers.id }).from(schema.centers).where(eq(schema.centers.slug, centerSlug)).limit(1) : [];
    await db.insert(schema.appointments).values({
      ...person,
      itemSlug: field(form, "item", 120) || null,
      preferredDate: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
      centerId: center?.id ?? null,
      note: field(form, "note", 1000) || null,
    });
    return { ok: true };
  } catch (error) {
    console.error("submitAppointment failed", error);
    return { ok: false, error: "Chưa gửi được lịch hẹn. Vui lòng thử lại hoặc gọi tổng đài." };
  }
}

/** "Yêu cầu tư vấn" popup → consult_requests (admin module 6). */
export async function submitConsultRequest(form: FormData): Promise<SubmitResult> {
  const person = contact(form);
  if ("error" in person) return { ok: false, error: person.error! };

  try {
    await db.insert(schema.consultRequests).values({ ...person, topic: field(form, "topic", 120) || null, note: field(form, "note", 1000) || null });
    return { ok: true };
  } catch (error) {
    console.error("submitConsultRequest failed", error);
    return { ok: false, error: "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi tổng đài." };
  }
}
