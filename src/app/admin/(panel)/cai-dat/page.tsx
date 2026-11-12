import { eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminForm } from "@/components/admin/admin-form";
import { Section, TextArea, TextInput } from "@/components/admin/admin-fields";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ModuleTabs, settingsTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { saveGeneral } from "@/lib/actions/admin/settings";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thông tin chung" };

type General = {
  name?: string;
  shortName?: string;
  slogan?: string;
  description?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  hotline?: { display?: string; note?: string };
  phone?: { display?: string };
};

export default async function GeneralSettingsPage() {
  await requireAdmin();
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, "general"));
  const general = (row?.value ?? {}) as General;
  return (
    <>
      <AdminPageHeader title="Menu & thông tin chung" description="Thông tin công ty hiện ở chân trang, trang liên hệ và khi chia sẻ website." />
      <ModuleTabs tabs={settingsTabs} current="/admin/cai-dat" />
      <AdminForm action={saveGeneral} cancelHref="/admin/cai-dat" submitLabel="Lưu thông tin">
        <Section title="Thương hiệu">
          <TextInput label="Tên đầy đủ" name="name" defaultValue={general.name} required maxLength={120} />
          <TextInput label="Tên ngắn" name="shortName" defaultValue={general.shortName} required maxLength={60} />
          <TextInput label="Slogan" name="slogan" defaultValue={general.slogan} required maxLength={120} />
          <TextArea label="Mô tả website" name="description" defaultValue={general.description} required rows={3} maxLength={400} hint="Hiện trên Google và khi chia sẻ link." />
        </Section>
        <Section title="Liên hệ">
          <div className="grid gap-4 tab:grid-cols-2">
            <TextInput label="Số tổng đài" name="hotlineDisplay" defaultValue={general.hotline?.display} required maxLength={40} />
            <TextInput label="Ghi chú tổng đài" name="hotlineNote" defaultValue={general.hotline?.note} maxLength={120} />
          </div>
          <div className="grid gap-4 tab:grid-cols-2">
            <TextInput label="Số điện thoại" name="phoneDisplay" defaultValue={general.phone?.display} required maxLength={40} />
            <TextInput label="Email" name="email" type="email" defaultValue={general.email} maxLength={120} />
          </div>
          <TextInput label="Địa chỉ" name="address" defaultValue={general.address} required maxLength={300} />
          <TextInput label="Giờ mở cửa" name="openingHours" defaultValue={general.openingHours} required maxLength={120} />
        </Section>
      </AdminForm>
    </>
  );
}
