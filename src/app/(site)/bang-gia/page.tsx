import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button-link";
import { getDiseaseGroups, getPackages, getVaccines } from "@/lib/data/catalog";
import { formatVnd } from "@/lib/format";
import { bookingHref } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Bảng giá tiêm chủng",
  description: "Bảng giá tham khảo vắc xin lẻ và gói vắc xin tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function PriceListPage() {
  const [vaccines, groups, packages] = await Promise.all([getVaccines(), getDiseaseGroups(), getPackages()]);
  return (
    <main className="flex-1">
      <PageHeader title="Bảng giá tiêm chủng" description="Giá tham khảo; giá cuối cùng được xác nhận tại trung tâm sau khi bác sĩ khám sàng lọc." crumbs={[{ label: "Bảng giá" }]} />

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site grid gap-4">
          {groups.map((group) => {
            const list = vaccines.filter((vaccine) => vaccine.diseaseSlugs[0] === group.slug);
            if (list.length === 0) return null;
            return (
              <div key={group.slug} className="overflow-hidden rounded-box bg-white">
                <h2 className="bg-surface-soft px-4 py-3 text-base font-bold text-brand-800 tab:px-6 desk:text-lg">{group.name}</h2>
                <ul>
                  {list.map((vaccine) => (
                    <li key={vaccine.slug} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-line px-4 py-3 tab:grid-cols-[1.4fr_1fr_auto_auto] tab:px-6">
                      <AppLink href={`/vac-xin/${vaccine.slug}`} className="font-bold text-brand-800 hover:underline">
                        {vaccine.name}
                        <span className="block text-[13px] font-normal text-subtle tab:hidden">
                          {vaccine.origin} · {vaccine.audience}
                        </span>
                      </AppLink>
                      <span className="hidden text-sm text-body tab:block">
                        {vaccine.origin} · {vaccine.audience}
                      </span>
                      <b className="text-right text-brand-600">{formatVnd(vaccine.price)}</b>
                      <ButtonLink href={bookingHref(vaccine.slug)} variant="secondary" size="sm" className="col-span-2 mt-1 tab:col-span-1 tab:mt-0">
                        Đặt lịch
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="overflow-hidden rounded-box bg-white">
            <h2 className="bg-surface-soft px-4 py-3 text-base font-bold text-brand-800 tab:px-6 desk:text-lg">Gói vắc xin</h2>
            <ul>
              {packages.map((pkg) => (
                <li key={pkg.slug} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-line px-4 py-3 tab:grid-cols-[1.4fr_1fr_auto_auto] tab:px-6">
                  <AppLink href={`/goi-vac-xin/${pkg.slug}`} className="font-bold text-brand-800 hover:underline">
                    {pkg.name}
                    <span className="block text-[13px] font-normal text-subtle tab:hidden">{pkg.audienceLabel}</span>
                  </AppLink>
                  <span className="hidden text-sm text-body tab:block">
                    {pkg.audienceLabel} · {pkg.doses} mũi
                  </span>
                  <span className="text-right">
                    <b className="block text-brand-600">{formatVnd(pkg.price)}</b>
                    <s className="text-xs text-subtle">{formatVnd(pkg.originalPrice)}</s>
                  </span>
                  <ButtonLink href={bookingHref(pkg.slug)} variant="secondary" size="sm" className="col-span-2 mt-1 tab:col-span-1 tab:mt-0">
                    Đặt lịch
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
