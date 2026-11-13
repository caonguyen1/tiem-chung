"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { FormError, type FormState, text } from "@/lib/admin/form";
import { APPOINTMENT_STATUSES, CONSULT_STATUSES } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
type ConsultStatus = (typeof CONSULT_STATUSES)[number];

/** Quick status change from a list row. */
export async function setAppointmentStatus(form: FormData) {
  await requireAdmin();
  const status = text(form, "status", 20);
  if (!(APPOINTMENT_STATUSES as readonly string[]).includes(status)) return;
  await db.update(schema.appointments).set({ status: status as AppointmentStatus }).where(eq(schema.appointments.id, Number(form.get("id"))));
}

/** Detail screen: status and the staff's private note. */
export async function saveAppointment(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const status = text(form, "status", 20);
    if (!(APPOINTMENT_STATUSES as readonly string[]).includes(status)) throw new FormError("Vui lòng chọn trạng thái.");
    await db
      .update(schema.appointments)
      .set({ status: status as AppointmentStatus, staffNote: text(form, "staffNote", 2000) || null })
      .where(eq(schema.appointments.id, Number(form.get("id"))));
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  redirect("/admin/lich-hen");
}

export async function deleteAppointment(form: FormData) {
  await requireAdmin();
  await db.delete(schema.appointments).where(eq(schema.appointments.id, Number(form.get("id"))));
}

export async function setConsultStatus(form: FormData) {
  await requireAdmin();
  const status = text(form, "status", 20);
  if (!(CONSULT_STATUSES as readonly string[]).includes(status)) return;
  await db.update(schema.consultRequests).set({ status: status as ConsultStatus }).where(eq(schema.consultRequests.id, Number(form.get("id"))));
}

export async function saveConsult(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const status = text(form, "status", 20);
    if (!(CONSULT_STATUSES as readonly string[]).includes(status)) throw new FormError("Vui lòng chọn trạng thái.");
    await db
      .update(schema.consultRequests)
      .set({ status: status as ConsultStatus, staffNote: text(form, "staffNote", 2000) || null })
      .where(eq(schema.consultRequests.id, Number(form.get("id"))));
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  redirect("/admin/tu-van");
}

export async function deleteConsult(form: FormData) {
  await requireAdmin();
  await db.delete(schema.consultRequests).where(eq(schema.consultRequests.id, Number(form.get("id"))));
}
