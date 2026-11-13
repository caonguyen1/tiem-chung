import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AccountForm } from "@/components/admin/account-forms";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa tài khoản" };

export default async function EditAccountPage({ params }: PageProps<"/admin/tai-khoan/[id]">) {
  const me = await requireAdmin(["admin"]);
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  if (!user) notFound();
  return (
    <>
      <AdminPageHeader title={user.name} description={user.email} />
      <AccountForm user={user} isSelf={user.id === me.id} />
    </>
  );
}
