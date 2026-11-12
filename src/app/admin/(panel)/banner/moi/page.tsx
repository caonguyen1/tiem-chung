import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BannerForm } from "@/components/admin/banner-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm banner" };

export default async function NewBannerPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm banner" />
      <BannerForm />
    </>
  );
}
