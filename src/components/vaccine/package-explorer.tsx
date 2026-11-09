import type { PackageDetail, VaccinePackage } from "@/content/types";

import { BrandIconByName } from "../icons/brand-icons";
import { PackageBuilder } from "./package-builder";
import { PackageList } from "./package-list";

/**
 * Packages page body: the tabbed list of packages on the left, the chosen one on the right. Each
 * item in the list is a link to `/goi-vac-xin/<slug>`, so a "Chi tiết" button anywhere on the
 * site lands here with that package already active. On phones the list becomes a row of
 * cards to swipe above the detail.
 */
export function PackageExplorer({ packages, active }: { packages: VaccinePackage[]; active: PackageDetail }) {
  return (
    <div className="grid grid-cols-1 gap-3 desk:grid-cols-[340px_minmax(0,1fr)] desk:items-start desk:gap-5">
      <PackageList packages={packages} activeSlug={active.slug} />

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
