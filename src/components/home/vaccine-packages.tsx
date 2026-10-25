"use client";

import { ArrowRight, BellRing, PackageCheck, ShieldCheck } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { useState } from "react";

import type { VaccinePackage } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";
import { isNavigable } from "@/lib/routes";

import { BrandIconByName } from "../icons/brand-icons";
import { SectionHeading } from "../ui/section-heading";

const tabs = [
  { kind: "age", label: "Theo độ tuổi" },
  { kind: "audience", label: "Theo đối tượng" },
] as const;

const promises = [
  { Icon: ShieldCheck, text: "Giữ giá trọn gói" },
  { Icon: PackageCheck, text: "Đảm bảo đủ vắc xin" },
  { Icon: BellRing, text: "Nhắc lịch từng mũi" },
];

export function VaccinePackages({ packages }: { packages: VaccinePackage[] }) {
  const [kind, setKind] = useState<VaccinePackage["kind"]>("age");
  const list = packages.filter((p) => p.kind === kind);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Gói vắc xin"
          title="Trọn gói theo từng giai đoạn"
          description="Tiêm đủ, tiêm đúng lịch và tiết kiệm hơn so với tiêm lẻ. Bỏ chọn mũi đã tiêm để tính lại giá ngay trong trang chi tiết."
          action={{ label: "Tất cả gói vắc xin", href: "/goi-vac-xin" }}
        />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Loại gói" className="inline-flex w-fit rounded-full bg-brand-50 p-1">
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
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-muted">
            {promises.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon className="size-4 text-brand-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <ul role="tabpanel" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((pkg) => (
            <li key={pkg.slug}>
              <PackageCard pkg={pkg} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PackageCard({ pkg }: { pkg: VaccinePackage }) {
  const detailHref = `/goi-vac-xin/${pkg.slug}`;
  const live = isNavigable(detailHref);
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition duration-300 ${live ? "hover:-translate-y-1 hover:shadow-lift" : ""}`}
    >
      <div className="relative flex items-center gap-4 bg-gradient-to-br from-brand-50 to-white p-5">
        <BrandIconByName name={pkg.icon} className="size-16 shrink-0" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-brand-500">{pkg.audienceLabel}</p>
          <h3 className="mt-0.5 text-lg leading-snug font-bold text-brand-800">
            <AppLink href={detailHref} className="after:absolute after:inset-0">
              {pkg.name}
            </AppLink>
          </h3>
        </div>
        {pkg.highlight && (
          <span className="absolute top-3 right-3 rounded-full bg-sun-400 px-2.5 py-0.5 text-[11px] font-bold text-brand-900">
            {pkg.highlight}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="text-[14px] text-muted">
          <strong className="font-semibold text-ink">{pkg.vaccineCount} loại vắc xin</strong> · {pkg.doses} mũi tiêm
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="flex items-center gap-2 text-[13px]">
              <span className="text-muted line-through">{formatVnd(pkg.originalPrice)}</span>
              <span className="rounded bg-alert/10 px-1.5 font-semibold text-alert">-{discountPercent(pkg.price, pkg.originalPrice)}%</span>
            </p>
            <p className="text-[22px] font-bold text-brand-700">{formatVnd(pkg.price)}</p>
          </div>
          {live && (
            <span className="grid size-11 place-items-center rounded-full bg-brand-600 text-white transition group-hover:bg-sun-400 group-hover:text-brand-900">
              <ArrowRight className="size-5" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
