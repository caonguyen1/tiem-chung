"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { flag, FormError, type FormState, must, text } from "@/lib/admin/form";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { currentSessionId, requireAdmin, revokeSessions } from "@/lib/auth/session";

const users = schema.adminUsers;
const LIST = "/admin/tai-khoan";
const MIN_PASSWORD = 10;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkPassword(password: string, email: string) {
  if (password.length < MIN_PASSWORD) throw new FormError(`Mật khẩu cần ít nhất ${MIN_PASSWORD} ký tự.`);
  if (password.toLowerCase() === email.toLowerCase()) throw new FormError("Mật khẩu không được trùng với email.");
}

/** Active admins other than `id` (the roles that can still manage accounts). */
async function otherActiveAdmins(id: number) {
  const [row] = await db.select({ n: count() }).from(users).where(and(eq(users.role, "admin"), eq(users.isActive, true), ne(users.id, id)));
  return row.n;
}

/**
 * Admin account (module 13): create when `id` is empty, otherwise update. Only admins.
 * Safeguards: you cannot demote or deactivate yourself, and one active admin must always remain.
 */
export async function saveAccount(_state: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin(["admin"]);
  try {
    const id = Number(form.get("id")) || 0;
    const email = must(form, "email", "email", 200).toLowerCase();
    if (!EMAIL.test(email)) throw new FormError("Email chưa đúng định dạng.");
    const name = must(form, "name", "họ tên", 120);
    const role = text(form, "role", 10);
    if (role !== "admin" && role !== "editor") throw new FormError("Vui lòng chọn vai trò.");
    const isActive = flag(form, "isActive");
    const password = String(form.get("password") ?? "");

    if (!id) {
      checkPassword(password, email);
      await db.insert(users).values({ email, name, role, isActive, passwordHash: await hashPassword(password) });
    } else {
      const [target] = await db.select().from(users).where(eq(users.id, id));
      if (!target) throw new FormError("Không tìm thấy tài khoản.");
      const losesAdmin = target.role === "admin" && target.isActive && (role !== "admin" || !isActive);
      if (id === me.id && (role !== "admin" || !isActive)) throw new FormError("Bạn không thể tự hạ quyền hoặc tự khóa tài khoản của mình.");
      if (losesAdmin && (await otherActiveAdmins(id)) === 0) throw new FormError("Phải còn ít nhất một quản trị viên đang hoạt động.");

      const values: Partial<typeof users.$inferInsert> = { email, name, role, isActive };
      if (password) {
        checkPassword(password, email);
        values.passwordHash = await hashPassword(password);
      }
      await db.update(users).set(values).where(eq(users.id, id));
      // New password, lower role or disabled account: the person has to sign in again.
      if (password || !isActive || role !== target.role) await revokeSessions(id, id === me.id ? await currentSessionId() : null);
    }
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    const code = (error as { code?: string; cause?: { code?: string } })?.code ?? (error as { cause?: { code?: string } })?.cause?.code;
    if (code === "23505") return { error: "Email này đã có tài khoản." };
    throw error;
  }
  redirect(LIST);
}

/** Deactivate or reactivate from the list. */
export async function toggleAccount(form: FormData) {
  const me = await requireAdmin(["admin"]);
  const id = Number(form.get("id"));
  const active = form.get("visible") === "on";
  const [target] = await db.select().from(users).where(eq(users.id, id));
  if (!target || id === me.id) return;
  if (!active && target.role === "admin" && target.isActive && (await otherActiveAdmins(id)) === 0) return;
  await db.update(users).set({ isActive: active }).where(eq(users.id, id));
  if (!active) await revokeSessions(id);
}

export async function deleteAccount(form: FormData) {
  const me = await requireAdmin(["admin"]);
  const id = Number(form.get("id"));
  const [target] = await db.select().from(users).where(eq(users.id, id));
  if (!target || id === me.id) return;
  if (target.role === "admin" && target.isActive && (await otherActiveAdmins(id)) === 0) return;
  await db.delete(users).where(eq(users.id, id)); // sessions go with it (schema: cascade)
}

/** Everyone changes their own password here (current password required). */
export async function changeOwnPassword(_state: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  try {
    const current = String(form.get("current") ?? "");
    const next = String(form.get("next") ?? "");
    if (next !== String(form.get("confirm") ?? "")) throw new FormError("Mật khẩu nhập lại chưa khớp.");
    const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, me.id));
    if (!row || !(await verifyPassword(current, row.hash))) throw new FormError("Mật khẩu hiện tại chưa đúng.");
    checkPassword(next, me.email);
    if (next === current) throw new FormError("Mật khẩu mới phải khác mật khẩu hiện tại.");
    await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, me.id));
    // Other browsers and devices are signed out; this one stays.
    await revokeSessions(me.id, await currentSessionId());
  } catch (error) {
    if (error instanceof FormError) return { error: error.message };
    throw error;
  }
  redirect("/admin/mat-khau?da-doi=1");
}
