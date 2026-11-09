import type { PackageDetail, VaccinePackage } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";

import { BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";
import { PackageBuilder } from "./package-builder";
import { ScrollActive } from "./scroll-active";

const groups: { kind: VaccinePackage["kind"]; title: string }[] = [
  { kind: "age", title: "Theo độ tuổi" },
  { kind: "audience", title: "Theo đối tượng" },
];

/**
 * Packages page body: the list of packages on the left, the chosen one on the right. Each
 * item in the list is a link to `/goi-vac-xin/<slug>`, so a "Chi tiết" button anywhere on the
 * site lands here with that package already active. On phones the list becomes a row of
 * cards to swipe above the detail.
 */
export function PackageExplorer({ packages, active }: { packages: VaccinePackage[]; active: PackageDetail }) {
  return (
    <div className="grid grid-cols-1 gap-3 desk:grid-cols-[340px_minmax(0,1fr)] desk:items-start desk:gap-5">
      <nav id="package-list" aria-label="Danh sách gói vắc xin" className="min-w-0 desk:sticky desk:top-4 desk:max-h-[calc(100dvh-2rem)] desk:overflow-y-auto desk:rounded-box desk:bg-white desk:p-3">
        {groups.map((group) => {
          const list = packages.filter((pkg) => pkg.kind === group.kind);
          if (list.length === 0) return null;
          return (
            <div key={group.kind} className="mb-3 last:mb-0">
              <h2 className="mb-2 px-1 text-[13px] font-bold tracking-[0.04em] text-subtle uppercase">
                {list.length} gói {group.title.toLowerCase()}
              </h2>
              <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 desk:mx-0 desk:grid desk:gap-1.5 desk:overflow-visible desk:p-0">
                {list.map((pkg) => {
                  const current = pkg.slug === active.slug;
                  return (
                    <li key={pkg.slug} className="w-[72%] max-w-[260px] shrink-0 snap-start desk:w-auto desk:max-w-none">
                      <AppLink
                        href={`/goi-vac-xin/${pkg.slug}`}
                        aria-current={current ? "page" : undefined}
                        scroll={false}
                        className={`flex h-full items-center gap-2.5 rounded-xl border p-2.5 transition ${current ? "border-brand-600 bg-surface-soft ring-1 ring-brand-600" : "border-line bg-white hover:border-brand-bright"}`}
                      >
                        <BrandIconByName name={pkg.icon} className="size-11 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-link">{pkg.audienceLabel}</span>
                          <b className="block text-[14.5px] leading-tight text-brand-800">{pkg.name}</b>
                          <span className="mt-1 flex flex-wrap items-center gap-x-2 text-[12.5px] text-subtle">
                            {formatVnd(pkg.price)}
                            <span className="rounded-md bg-warn-soft px-1.5 py-px text-[11px] font-bold text-warn">-{discountPercent(pkg.price, pkg.originalPrice)}%</span>
                          </span>
                        </span>
                      </AppLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        <ScrollActive listSelector="#package-list" />
      </nav>

      <section aria-labelledby="package-title" className="min-w-0 overflow-hidden rounded-box bg-white">
        <header className="flex items-center gap-3 bg-surface-soft px-4 py-4 tab:px-6 desk:px-7 desk:py-5">
          <BrandIconByName name={active.icon} className="size-14 shrink-0 desk:size-16" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-link">
              {active.audienceLabel} · {active.vaccineCount} loại vắc xin, {active.doses} mũi
              {active.highlight && <span className="ml-2 rounded-md bg-brand-600 px-2 py-0.5 text-[11px] text-sun-400">{active.highlight}</span>}
            </p>
            <h1 id="package-title" className="text-xl leading-tight font-bold text-brand-800 tab:text-2xl desk:text-[28px]">
              {active.name}
            </h1>
            {active.description && <p className="mt-1 hidden text-[15px] text-body tab:block">{active.description}</p>}
          </div>
        </header>
        <div className="p-3 tab:p-5 desk:p-6">
          {/* Re-mounted per package so the ticked doses start full. */}
          <PackageBuilder key={active.slug} pkg={active} />
        </div>
      </section>
    </div>
  );
}
