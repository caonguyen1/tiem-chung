"use client";

import { useState } from "react";

import type { VaccinePackage } from "@/content/types";
import { isNavigable } from "@/lib/routes";

import { ButtonLink } from "../ui/button-link";
import { SectionTitle } from "../ui/section-title";
import { Wave } from "../ui/wave";
import { PackageCard } from "../vaccine/package-card";

const TABS: { kind: VaccinePackage["kind"]; label: string }[] = [
  { kind: "age", label: "Theo độ tuổi" },
  { kind: "audience", label: "Theo đối tượng" },
];
const SHOWN = 4;
const ALL_PACKAGES = "/goi-vac-xin";

/**
 * "Gói vắc xin" on a light blue band (client feedback 2026-11-03), joined to the white
 * section above and the white-to-blue section below by curves.
 */
export function PackagesSection({ packages }: { packages: VaccinePackage[] }) {
  const [kind, setKind] = useState<VaccinePackage["kind"]>("age");
  const shown = packages.filter((pkg) => pkg.kind === kind).slice(0, SHOWN);

  return (
    <section id="goi-vac-xin" className="relative scroll-mt-3 overflow-hidden bg-surface pt-12 pb-14 tab:pt-[72px] tab:pb-20 desk:pt-[88px] desk:pb-24">
      <Wave edge="top" className="text-white" />
      <Wave edge="bottom" className="text-white" />
      <div className="relative z-[2] container-site">
        <SectionTitle
          title="Gói vắc xin"
          description="Lịch tiêm bác sĩ sắp sẵn, không lo trễ mũi."
          className="flex-col !items-start tab:flex-row tab:!items-center"
          aside={
            <div role="tablist" aria-label="Loại gói" className="inline-flex rounded-full bg-white p-1 ring-1 ring-line ring-inset desk:p-[5px]">
              {TABS.map((tab) => (
                <button
                  key={tab.kind}
                  type="button"
                  role="tab"
                  aria-selected={kind === tab.kind}
                  onClick={() => setKind(tab.kind)}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-bold desk:px-5 desk:py-[9px] desk:text-[15px] ${kind === tab.kind ? "bg-brand-600 text-white" : "text-subtle"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:gap-2.5 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
          {shown.map((pkg) => (
            <li key={pkg.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
              <PackageCard pkg={pkg} />
            </li>
          ))}
        </ul>
        {/* "Xem tất cả" only appears once the package listing page exists. */}
        {isNavigable(ALL_PACKAGES) && (
          <div className="mt-3 flex justify-center tab:mt-7">
            <ButtonLink href={ALL_PACKAGES} variant="secondary">
              Xem tất cả gói vắc xin
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
