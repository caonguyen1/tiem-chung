import { inArray } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminForm } from "@/components/admin/admin-form";
import { Section, TextArea, TextInput } from "@/components/admin/admin-fields";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ModuleTabs, settingsTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { saveHotline } from "@/lib/actions/admin/settings";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Tổng đài và mạng xã hội" };

const networks = [
  ["facebook", "Facebook"],
  ["zalo", "Zalo"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
] as const;

export default async function HotlineSettingsPage() {
  await requireAdmin();
  const rows = await db.select().from(schema.siteSettings).where(inArray(schema.siteSettings.key, ["hotline", "social"]));
  const value = (key: string) => rows.find((row) => row.key === key)?.value;
  const hotline = (value("hotline") ?? { hours: "", lines: [] }) as { hours: string; lines: { label: string; value: string; dial: string }[] };
  const social = (value("social") ?? []) as { network: string; href: string }[];
  return (
    <>
      <AdminPageHeader title="Menu & thông tin chung" description="Các nhánh tổng đài và đường dẫn mạng xã hội. Mạng xã hội chưa có link thì biểu tượng vẫn hiện nhưng chưa bấm được." />
      <ModuleTabs tabs={settingsTabs} current="/admin/cai-dat/tong-dai" />
      <AdminForm action={saveHotline} cancelHref="/admin/cai-dat/tong-dai" submitLabel="Lưu">
        <Section title="Tổng đài">
          <TextInput label="Giờ làm việc của tổng đài" name="hours" defaultValue={hotline.hours} required maxLength={120} hint='Ví dụ: "7:30 – 20:00".' />
          <TextArea
            label="Các nhánh tổng đài"
            name="lines"
            defaultValue={hotline.lines.map((line) => `${line.label} | ${line.value} | ${line.dial}`).join("\n")}
            rows={4}
            hint="Mỗi dòng một nhánh: Nhãn | Số hiển thị | Số bấm gọi (có thể bỏ số bấm gọi, hệ thống tự lấy từ số hiển thị)."
          />
        </Section>
        <Section title="Mạng xã hội">
          {networks.map(([key, label]) => (
            <TextInput key={key} label={label} name={key} defaultValue={social.find((item) => item.network === key)?.href ?? ""} placeholder="https://" maxLength={600} />
          ))}
        </Section>
      </AdminForm>
    </>
  );
}
