"use server";

import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export type LoginState = { error?: string };

// Failed sign-ins per address and email in the last 15 minutes. In memory, which is enough for a
// single server; move it to the database if the site ever runs on several.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, number[]>();

function recent(key: string) {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  failures.set(key, list);
  return list;
}

/** Admin sign-in form. Same message for a wrong email and a wrong password. */
export async function login(_state: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Vui lòng nhập email và mật khẩu." };

  const address = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const keys = [`ip:${address}`, `email:${email}`];
  if (keys.some((key) => recent(key).length >= MAX_FAILURES)) {
    return { error: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút." };
  }

  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid || !user.isActive) {
    for (const key of keys) failures.set(key, [...recent(key), Date.now()]);
    return { error: "Email hoặc mật khẩu chưa đúng." };
  }

  for (const key of keys) failures.delete(key);
  await createSession(user.id);
  await db.update(schema.adminUsers).set({ lastLoginAt: sql`now()` }).where(eq(schema.adminUsers.id, user.id));
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/dang-nhap");
}
