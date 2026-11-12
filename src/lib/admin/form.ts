/** Helpers for reading admin form data inside Server Actions. */

export type FormState = { error?: string; saved?: boolean };

/** Thrown by `must`/`read` helpers to stop an action with a message for the form. */
export class FormError extends Error {}

export function text(form: FormData, name: string, max = 500) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** A required text field; throws a FormError naming the field when empty. */
export function must(form: FormData, name: string, label: string, max = 500) {
  const value = text(form, name, max);
  if (!value) throw new FormError(`Vui lòng nhập ${label}.`);
  return value;
}

export function optional(form: FormData, name: string, max = 500) {
  return text(form, name, max) || null;
}

export function flag(form: FormData, name: string) {
  return form.get(name) === "on";
}

export function number(form: FormData, name: string, label: string, { min = -Infinity, max = Infinity, required = false } = {}) {
  const raw = text(form, name, 40).replace(",", ".");
  if (!raw) {
    if (required) throw new FormError(`Vui lòng nhập ${label}.`);
    return null;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) throw new FormError(`${label} chưa hợp lệ.`);
  return value;
}

export function date(form: FormData, name: string) {
  const raw = text(form, name, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00+07:00`) : null;
}

/** `yyyy-mm-dd` for a date input, in Vietnam time (dates are stored as 00:00 +07). */
export function dateInput(value: Date | null | undefined) {
  return value ? new Date(value.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";
}

/** Only addresses this site serves or plain http(s) links; keeps `javascript:` out of saved links. */
export function url(form: FormData, name: string, label: string, max = 600) {
  const value = text(form, name, max);
  if (!value) return null;
  if (value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  throw new FormError(`${label} phải bắt đầu bằng http:// hoặc https://.`);
}

/** An uploaded image address: ours (`/uploads/…`), a site image (`/images/…`) or an http(s) link. */
export function image(form: FormData, name: string) {
  const value = text(form, name, 300);
  if (!value) return null;
  if (value.startsWith("/uploads/") || value.startsWith("/images/") || /^https?:\/\//i.test(value)) return value;
  throw new FormError("Ảnh chưa hợp lệ, vui lòng chọn lại.");
}

/** "Tiêm chủng cho bé" → "tiem-chung-cho-be". */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Message for a Postgres unique violation, or null for any other error. */
export function uniqueViolation(error: unknown) {
  const code = (error as { code?: string; cause?: { code?: string } } | null)?.code ?? (error as { cause?: { code?: string } } | null)?.cause?.code;
  return code === "23505" ? "Đường dẫn (slug) này đã được dùng, vui lòng đổi sang tên khác." : null;
}
