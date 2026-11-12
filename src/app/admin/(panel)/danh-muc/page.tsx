import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { SimpleList } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deleteAgeGroup, deleteDiseaseGroup, moveAgeGroup, moveDiseaseGroup, toggleAgeGroup, toggleDiseaseGroup } from "@/lib/actions/admin/categories";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Danh mục" };

const add = "inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700";

export default async function CategoriesPage() {
  await requireAdmin();
  const [groups, ages, origins] = await Promise.all([
    db.select().from(schema.diseaseGroups).orderBy(asc(schema.diseaseGroups.sortOrder)),
    db.select().from(schema.ageGroups).orderBy(asc(schema.ageGroups.sortOrder)),
    db.selectDistinct({ origin: schema.vaccines.origin }).from(schema.vaccines).orderBy(asc(schema.vaccines.origin)),
  ]);

  return (
    <>
      <AdminPageHeader title="Danh mục" description="Nhóm bệnh và khoảng tuổi dùng cho bộ lọc và trang chủ. Dùng mũi tên để đổi thứ tự." />
      <div className="grid gap-5">
        <AdminCard
          title="Nhóm bệnh"
          action={
            <Link href="/admin/danh-muc/nhom-benh/moi" className={add}>
              <Plus aria-hidden="true" className="size-4" />
              Thêm nhóm bệnh
            </Link>
          }
        >
          <SimpleList
            title="Nhóm bệnh"
            rows={groups.map((group) => ({ id: group.id, title: group.name, meta: `/${group.slug}${group.featured ? " · hiện ở trang chủ" : ""}`, visible: group.isVisible }))}
            basePath="/admin/danh-muc/nhom-benh"
            onToggle={toggleDiseaseGroup}
            onMove={moveDiseaseGroup}
            onDelete={deleteDiseaseGroup}
            deleteMessage={(row) => `Xóa nhóm bệnh "${row.title}"? Các vắc xin sẽ không còn thuộc nhóm này.`}
            empty="Chưa có nhóm bệnh."
          />
        </AdminCard>

        <AdminCard
          title="Khoảng tuổi"
          action={
            <Link href="/admin/danh-muc/do-tuoi/moi" className={add}>
              <Plus aria-hidden="true" className="size-4" />
              Thêm khoảng tuổi
            </Link>
          }
        >
          <SimpleList
            title="Khoảng tuổi"
            rows={ages.map((age) => ({ id: age.id, title: age.label, meta: `Mã: ${age.slug}`, visible: age.isVisible }))}
            basePath="/admin/danh-muc/do-tuoi"
            onToggle={toggleAgeGroup}
            onMove={moveAgeGroup}
            onDelete={deleteAgeGroup}
            deleteMessage={(row) => `Xóa khoảng tuổi "${row.title}"? Gợi ý “Tôi nên tiêm gì” của khoảng tuổi này cũng bị xóa.`}
            empty="Chưa có khoảng tuổi."
          />
        </AdminCard>

        <AdminCard title="Nơi sản xuất">
          <div className="px-4 py-4 tab:px-5">
            <p className="text-[15px] text-subtle">Danh sách nơi sản xuất của bộ lọc tự lấy từ trường “Nước sản xuất” của từng vắc xin, nên không cần nhập riêng.</p>
            <p className="mt-2 flex flex-wrap gap-2">
              {origins.map((row) => (
                <span key={row.origin} className="rounded-full bg-surface px-3 py-1 text-sm font-bold text-brand-600">
                  {row.origin}
                </span>
              ))}
            </p>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
