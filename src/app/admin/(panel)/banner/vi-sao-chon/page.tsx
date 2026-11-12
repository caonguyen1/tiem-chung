import { eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { WhyForm } from "@/components/admin/home-forms";
import { bannerTabs, ModuleTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Vì sao chọn Tâm Trí" };

export default async function WhyAdminPage() {
  await requireAdmin();
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, "whyChooseUs"));
  const items = (row?.value ?? []) as { icon: string; title: string; text: string }[];
  return (
    <>
      <AdminPageHeader title="Vì sao chọn Tâm Trí" description="Bốn cam kết hiện ở dải dưới banner và ở khối “Vì sao gia đình chọn Tâm Trí?” trên trang chủ và trang Gói vắc xin." />
      <ModuleTabs tabs={bannerTabs} current="/admin/banner/vi-sao-chon" />
      <WhyForm items={items} />
    </>
  );
}
