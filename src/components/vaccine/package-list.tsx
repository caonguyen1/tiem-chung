"use client";

import { useEffect, useState } from "react";

import type { VaccinePackage } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";

import { BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";

const tabs: { kind: VaccinePackage["kind"]; label: string }[] = [
  { kind: "age", label: "Theo độ tuổi" },
  { kind: "audience", label: "Theo đối tượng" },
];

/**
 * Left column of the packages page: two tabs (by age / by audience) and the packages of the
 * chosen tab. Each package links to `/goi-vac-xin/<slug>`; the tab opens on the active package's
 * kind. On phones the list is a row of cards to swipe.
 */
export function PackageList({ packages, activeSlug }: { packages: VaccinePackage[]; activeSlug: string }) {
  const activeKind = packages.find((pkg) => pkg.slug === activeSlug)?.kind ?? "age";
  const [kind, setKind] = useState(activeKind);
  const list = packages.filter((pkg) => pkg.kind === kind);

  // Bring the active package into view after navigating to it (sideways on phones, inside the list on desktop).
  useEffect(() => {
    document.querySelector('#package-list [aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [activeSlug]);

  return (
    <nav id="package-list" aria-label="Danh sách gói vắc xin" className="min-w-0 desk:sticky desk:top-4 desk:rounded-box desk:bg-white desk:p-3">
      <div role="tablist" aria-label="Nhóm gói" className="grid grid-cols-2 rounded-full bg-white p-1 ring-1 ring-line ring-inset desk:bg-surface-soft">
        {tabs.map((tab) => (
          <button
            key={tab.kind}
            type="button"
            role="tab"
            aria-selected={kind === tab.kind}
            onClick={() => setKind(tab.kind)}
            className={`h-10 rounded-full px-3 text-sm font-bold transition ${kind === tab.kind ? "bg-brand-600 text-white" : "text-brand-600 hover:bg-brand-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="mt-3 flex snap-x scroll-px-4 gap-2 overflow-x-auto pb-2 desk:mt-3 desk:grid desk:max-h-[calc(100dvh-8rem)] desk:snap-none desk:gap-1.5 desk:overflow-y-auto desk:overflow-x-hidden desk:pr-1 desk:pb-0">
        {list.map((pkg) => {
          const current = pkg.slug === activeSlug;
          return (
            <li key={pkg.slug} className="w-[72%] max-w-[260px] shrink-0 snap-start desk:w-auto desk:max-w-none">
              <AppLink
                href={`/goi-vac-xin/${pkg.slug}`}
                aria-current={current ? "page" : undefined}
                scroll={false}
                className={`flex h-full items-center gap-2.5 rounded-xl border p-2.5 transition ${current ? "border-brand-600 bg-surface-soft ring-1 ring-inset ring-brand-600" : "border-line bg-white hover:border-brand-bright"}`}
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
    </nav>
  );
}
