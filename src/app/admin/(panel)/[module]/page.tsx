import { Construction } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { adminModules, phaseLabel } from "@/lib/admin/modules";
import { requireAdmin } from "@/lib/auth/session";

export async function generateStaticParams() {
  return adminModules.map((item) => ({ module: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/admin/[module]">): Promise<Metadata> {
  const { module: slug } = await params;
  const found = adminModules.find((item) => item.slug === slug);
  return found ? { title: found.label } : {};
}

/** Placeholder for a module whose screens are built in a later phase; also enforces the module's roles. */
export default async function AdminModulePage({ params }: PageProps<"/admin/[module]">) {
  const admin = await requireAdmin();
  const { module: slug } = await params;
  const current = adminModules.find((item) => item.slug === slug);
  if (!current || (current.roles && !current.roles.includes(admin.role))) notFound();

  return (
    <>
      <AdminPageHeader title={current.label} description={current.description} />
      <AdminCard>
        <div className="grid justify-items-center gap-2 px-5 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-sun-100 text-sun-600">
            <Construction aria-hidden="true" className="size-7" />
          </span>
          <p className="text-lg font-bold text-brand-800">Module {current.number} đang được xây dựng</p>
          <p className="max-w-md text-[15px] text-subtle">Màn hình quản lý này sẽ có ở {phaseLabel[current.phase]}. Hiện tại dữ liệu vẫn nhập qua file mẫu và cơ sở dữ liệu.</p>
        </div>
      </AdminCard>
    </>
  );
}
