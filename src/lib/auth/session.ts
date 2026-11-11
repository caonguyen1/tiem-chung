import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db, schema } from "@/db";

const COOKIE = "tt_admin_session";
const DAYS = 7;

export type AdminUser = { id: number; email: string; name: string; role: "admin" | "editor" };

const digest = (token: string) => createHash("sha256").update(token).digest("hex");

/** Starts a session for the user: a random token in an httpOnly cookie, its SHA-256 in the database. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
  await db.insert(schema.adminSessions).values({ id: digest(token), userId, expiresAt });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.delete(schema.adminSessions).where(eq(schema.adminSessions.id, digest(token)));
  jar.delete(COOKIE);
}

/**
 * The signed-in admin, or null. Reads the request cookie, so call it behind a Suspense
 * boundary. The layout and a page each call it: two cheap lookups (React's `cache` breaks the
 * cookies object after a Server Action, so it is not used).
 */
export async function getAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ id: schema.adminUsers.id, email: schema.adminUsers.email, name: schema.adminUsers.name, role: schema.adminUsers.role })
    .from(schema.adminSessions)
    .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.adminSessions.userId))
    .where(and(eq(schema.adminSessions.id, digest(token)), gt(schema.adminSessions.expiresAt, sql`now()`), eq(schema.adminUsers.isActive, true)))
    .limit(1);
  return row ?? null;
}

/**
 * For every admin page and action: returns the signed-in admin or sends the visitor to the
 * sign-in page. Call it FIRST, before any query. The layout also checks, but Next renders a page
 * in parallel with its layout, so the layout alone does not stop a page from reading data.
 */
export async function requireAdmin(roles?: AdminUser["role"][]): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/dang-nhap");
  if (roles && !roles.includes(admin.role)) redirect("/admin");
  return admin;
}
