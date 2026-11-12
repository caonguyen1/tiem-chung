import { asc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminForm } from "@/components/admin/admin-form";
import { Section, TextArea, TextInput } from "@/components/admin/admin-fields";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ModuleTabs, settingsTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { saveMenus } from "@/lib/actions/admin/settings";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Menu" };

const HINT = "Mỗi dòng một mục: Nhãn | đường dẫn. Đường dẫn bắt đầu bằng / (trang trong website), # (mở popup như #dat-lich) hoặc http(s)://. Thứ tự dòng là thứ tự hiển thị.";

export default async function MenuSettingsPage() {
  await requireAdmin();
  const [items, [columns]] = await Promise.all([
    db.select().from(schema.menuItems).where(inArray(schema.menuItems.menu, ["header", "footer_services", "footer_about", "footer_policy"])).orderBy(asc(schema.menuItems.sortOrder)),
    db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, "footerColumns")),
  ]);
  const lines = (menu: string) => items.filter((item) => item.menu === menu).map((item) => `${item.label} | ${item.href}`).join("\n");
  const titles = (columns?.value ?? []) as { title: string; menu: string }[];

  return (
    <>
      <AdminPageHeader title="Menu & thông tin chung" description="Menu trên đầu trang và ba cột ở chân trang." />
      <ModuleTabs tabs={settingsTabs} current="/admin/cai-dat/menu" />
      <AdminForm action={saveMenus} cancelHref="/admin/cai-dat/menu" submitLabel="Lưu menu">
        <Section title="Menu đầu trang" description={HINT}>
          <TextArea label="Các mục" name="header" defaultValue={lines("header")} rows={8} />
        </Section>
        {(["footer_services", "footer_about", "footer_policy"] as const).map((menu, index) => (
          <Section key={menu} title={`Chân trang, cột ${index + 1}`} description={index === 0 ? HINT : undefined}>
            <TextInput label="Tiêu đề cột" name={`title${index}`} defaultValue={titles.find((column) => column.menu === menu)?.title} required maxLength={60} />
            <TextArea label="Các mục" name={menu} defaultValue={lines(menu)} rows={6} />
          </Section>
        ))}
      </AdminForm>
    </>
  );
}
