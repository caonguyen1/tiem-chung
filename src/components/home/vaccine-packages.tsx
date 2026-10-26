"use client";

import { ArrowRight, Star } from "lucide-react";
import { useState } from "react";

import type { VaccinePackage } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";
import { bookingHref } from "@/lib/routes";

import { BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";
import { SectionHeading } from "../ui/section-heading";

const tabs = [
  { kind: "age", label: "Theo độ tuổi" },
  { kind: "audience", label: "Theo đối tượng" },
] as const;

export function VaccinePackages({ packages }: { packages: VaccinePackage[] }) {
  const [kind, setKind] = useState<VaccinePackage["kind"]>("age");
  const list = packages.filter((p) => p.kind === kind);

  return (
    <section id="goi-vac-xin" className="scroll-mt-20 py-8 lg:scroll-mt-24 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Gói vắc xin"
          title="Gói tiêm theo từng giai đoạn"
          description="Tiêm đủ, đúng lịch theo độ tuổi hoặc nhu cầu. Mỗi gói ghi rõ số loại vắc xin, số mũi và chi phí."
        />

        <div role="tablist" aria-label="Loại gói" className="mt-4 grid w-full grid-cols-2 rounded-full bg-brand-50 p-1 md:mt-8 md:inline-grid md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.kind}
              type="button"
              role="tab"
              aria-selected={kind === tab.kind}
              onClick={() => setKind(tab.kind)}
              className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition ${
                kind === tab.kind ? "bg-white text-brand-700 shadow-card" : "text-muted hover:text-brand-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile: a swipeable row. Desktop: a grid. */}
        <ul
          role="tabpanel"
          className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-8 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-3"
        >
          {list.map((pkg) => (
            <li key={pkg.slug} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
              <PackageCard pkg={pkg} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-center md:mt-8">
          <ButtonLink href="/goi-vac-xin" variant="outline">
            Xem tất cả gói vắc xin
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function PackageCard({ pkg }: { pkg: VaccinePackage }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white md:rounded-[var(--radius-card)]">
      <div className="flex items-center gap-2.5 bg-gradient-to-br from-brand-50 to-white p-3 pr-11 md:gap-3.5 md:p-5 md:pr-5">
        <BrandIconByName name={pkg.icon} className="size-10 shrink-0 md:size-16" />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-brand-500 md:text-[13px]">{pkg.audienceLabel}</p>
          <h3 className="mt-0.5 text-[15px] leading-snug font-bold text-brand-800 md:text-[18px]">{pkg.name}</h3>
        </div>
        {pkg.highlight && (
          // Mobile: a star badge, so it never covers the package name. Desktop: the label.
          <span
            title={pkg.highlight}
            className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-sun-400 text-brand-900 shadow-card md:top-3 md:right-3 md:flex md:size-auto md:px-2.5 md:py-0.5 md:shadow-none"
          >
            <Star className="size-4 fill-current md:hidden" aria-hidden="true" />
            <span className="sr-only md:not-sr-only md:text-[11px] md:font-bold">{pkg.highlight}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-5 md:pt-4">
        <dl className="grid grid-cols-2 gap-1.5 md:gap-2">
          <Stat label="Loại vắc xin" value={pkg.vaccineCount} />
          <Stat label="Mũi tiêm" value={pkg.doses} />
        </dl>

        <div className="mt-2.5 md:mt-4">
          <p className="flex items-center gap-2 text-[12px] md:text-[13px]">
            <span className="text-muted line-through">{formatVnd(pkg.originalPrice)}</span>
            <span className="rounded bg-alert/10 px-1.5 font-semibold text-alert">-{discountPercent(pkg.price, pkg.originalPrice)}%</span>
          </p>
          <p className="text-[18px] font-bold text-brand-700 md:text-[22px]">{formatVnd(pkg.price)}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3 md:gap-2 md:pt-4">
          <ButtonLink href={`/goi-vac-xin/${pkg.slug}`} variant="outline" className="h-9 px-2 text-[13px] md:h-10 md:px-3 md:text-[14px]">
            Xem chi tiết
          </ButtonLink>
          <ButtonLink href={bookingHref(pkg.slug)} className="h-9 px-2 text-[13px] shadow-none md:h-10 md:px-3 md:text-[14px]">
            Đặt lịch
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse rounded-lg bg-canvas px-2.5 py-1.5 md:rounded-xl md:px-3 md:py-2">
      <dt className="text-[11px] text-muted md:text-[12px]">{label}</dt>
      <dd className="text-[15px] font-bold text-ink md:text-[18px]">{value}</dd>
    </div>
  );
}
