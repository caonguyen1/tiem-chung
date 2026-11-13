import "server-only";

import { and, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import ExcelJS from "exceljs";

import { db, schema } from "@/db";

type Raw = Record<string, string | string[] | undefined>;

const one = (raw: Raw, key: string) => {
  const value = raw[key];
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 80) ?? "";
};
const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const APPOINTMENT_STATUSES = ["new", "confirmed", "done", "cancelled"] as const;
export const CONSULT_STATUSES = ["new", "in_progress", "done"] as const;

export type AppointmentFilters = { q: string; center: string; status: string; from: string; to: string };
export type ConsultFilters = { q: string; status: string };

/** Reads the filter fields of the appointment list (also used by the Excel export). */
export function appointmentFilters(raw: Raw): { values: AppointmentFilters; where: SQL | undefined } {
  const values: AppointmentFilters = {
    q: one(raw, "q"),
    center: /^\d+$/.test(one(raw, "center")) ? one(raw, "center") : "",
    status: (APPOINTMENT_STATUSES as readonly string[]).includes(one(raw, "status")) ? one(raw, "status") : "",
    from: isDate(one(raw, "from")) ? one(raw, "from") : "",
    to: isDate(one(raw, "to")) ? one(raw, "to") : "",
  };
  const where = and(
    values.q ? or(ilike(schema.appointments.fullName, `%${values.q}%`), ilike(schema.appointments.phone, `%${values.q}%`)) : undefined,
    values.center ? eq(schema.appointments.centerId, Number(values.center)) : undefined,
    values.status ? eq(schema.appointments.status, values.status as (typeof APPOINTMENT_STATUSES)[number]) : undefined,
    values.from ? gte(schema.appointments.preferredDate, values.from) : undefined,
    values.to ? lte(schema.appointments.preferredDate, values.to) : undefined,
  );
  return { values, where };
}

export function consultFilters(raw: Raw): { values: ConsultFilters; where: SQL | undefined } {
  const values: ConsultFilters = {
    q: one(raw, "q"),
    status: (CONSULT_STATUSES as readonly string[]).includes(one(raw, "status")) ? one(raw, "status") : "",
  };
  const where = and(
    values.q ? or(ilike(schema.consultRequests.fullName, `%${values.q}%`), ilike(schema.consultRequests.phone, `%${values.q}%`), ilike(schema.consultRequests.topic, `%${values.q}%`)) : undefined,
    values.status ? eq(schema.consultRequests.status, values.status as (typeof CONSULT_STATUSES)[number]) : undefined,
  );
  return { values, where };
}

/** Name of a vaccine or package from its slug (what the booking form stores), for lists and exports. */
export async function itemNames() {
  const [vaccines, packages] = await Promise.all([
    db.select({ slug: schema.vaccines.slug, name: schema.vaccines.name }).from(schema.vaccines),
    db.select({ slug: schema.vaccinePackages.slug, name: schema.vaccinePackages.name }).from(schema.vaccinePackages),
  ]);
  return new Map<string, string>([...vaccines, ...packages].map((item) => [item.slug, item.name]));
}

/**
 * Text typed by visitors goes into the spreadsheet, so a cell that starts with = + - @ would run as
 * a formula when someone opens it. A leading apostrophe makes Excel treat it as plain text.
 */
function safe(value: unknown) {
  if (typeof value !== "string") return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/** Builds an .xlsx file (one sheet) and returns it as a download response. */
export async function xlsxResponse(filename: string, sheet: string, columns: { header: string; width: number }[], rows: unknown[][]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheet);
  worksheet.columns = columns.map((column) => ({ header: column.header, width: column.width }));
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  for (const row of rows) worksheet.addRow(row.map(safe));
  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

/** dd/mm/yyyy hh:mm in Vietnam time. */
export function vnDateTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function vnDate(value: string | null) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
