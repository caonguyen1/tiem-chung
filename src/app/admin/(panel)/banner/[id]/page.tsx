import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BannerForm } from "@/components/admin/banner-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa banner" };

export default async function EditBannerPage({ params }: PageProps<"/admin/banner/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [banner] = await db.select().from(schema.banners).where(eq(schema.banners.id, id));
  if (!banner) notFound();
  return (
    <>
      <AdminPageHeader title={banner.name} />
      <BannerForm banner={banner} />
    </>
  );
}
