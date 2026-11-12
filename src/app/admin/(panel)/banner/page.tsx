import { asc, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPageHeader, formatDateTime } from "@/components/admin/admin-ui";
import { SimpleList } from "@/components/admin/admin-list";
import { bannerTabs, ModuleTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { deleteBanner, moveBanner, toggleBanner } from "@/lib/actions/admin/banners";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Banner & trang chủ" };

const placementLabel = { hero: "Banner chính", promo: "Banner ưu đãi", popup: "Popup chào mừng" } as const;

export default async function BannersAdminPage() {
  await requireAdmin();
  const found = await db
    .select({ banner: schema.banners, expired: sql<boolean>`coalesce(${schema.banners.endsAt} < now(), false)` })
    .from(schema.banners)
    .orderBy(asc(schema.banners.placement), asc(schema.banners.sortOrder));

  return (
    <>
      <AdminPageHeader
        title="Banner & trang chủ"
        description="Banner chính, banner ưu đãi và popup chào mừng của trang chủ. Dùng mũi tên để đổi thứ tự trong cùng một vị trí."
        actions={
          <Link href="/admin/banner/moi" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[15px] font-bold text-white hover:bg-brand-700">
            <Plus aria-hidden="true" className="size-4" />
            Thêm banner
          </Link>
        }
      />
      <ModuleTabs tabs={bannerTabs} current="/admin/banner" />
      <SimpleList
        title="Banner"
        rows={found.map(({ banner: row, expired }) => {
          const schedule = row.startsAt || row.endsAt ? ` · ${row.startsAt ? `từ ${formatDateTime(row.startsAt).slice(0, 10)}` : ""}${row.endsAt ? ` đến ${formatDateTime(row.endsAt).slice(0, 10)}` : ""}` : "";
          const ended = expired ? " · đã hết hạn" : "";
          return { id: row.id, title: row.name, meta: `${placementLabel[row.placement]}${schedule}${ended}`, visible: row.isVisible };
        })}
        basePath="/admin/banner"
        onToggle={toggleBanner}
        onMove={moveBanner}
        onDelete={deleteBanner}
        deleteMessage={(row) => `Xóa banner "${row.title}"?`}
        empty="Chưa có banner."
      />
    </>
  );
}
