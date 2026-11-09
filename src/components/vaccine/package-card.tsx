import type { VaccinePackage } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";
import { bookingHref } from "@/lib/routes";

import { BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";

/**
 * Layout C package card. The highlighted package gets a 3px yellow border and the
 * navy/yellow "Phổ biến nhất" tag; both buttons stay pinned to the card's bottom.
 */
export function PackageCard({ pkg }: { pkg: VaccinePackage }) {
  const hot = Boolean(pkg.highlight);
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl bg-white ${hot ? "ring-[3px] ring-sun-400" : "ring-1 ring-line ring-inset"}`}
    >
      {hot && (
        <span className="absolute top-0 right-3 rounded-b-xl bg-brand-600 px-2 pt-1 pb-1.5 text-[11px] font-bold text-sun-400 desk:right-[18px] desk:px-2.5 desk:pt-1.5 desk:pb-2 desk:text-xs">
          {pkg.highlight}
        </span>
      )}
      <div className="flex items-center gap-2.5 px-3 pt-3.5 pb-3 desk:gap-3 desk:px-[18px] desk:pt-[18px] desk:pb-4">
        <BrandIconByName name={pkg.icon} className="size-11 shrink-0 desk:size-14" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-link desk:text-[13px]">{pkg.audienceLabel}</p>
          <h3 className="text-[15px] leading-tight font-bold text-brand-800 desk:text-[16.5px]">{pkg.name}</h3>
        </div>
      </div>
      <div className="mx-3 flex gap-1.5 desk:mx-[18px] desk:gap-2">
        <Stat value={pkg.doses} label="mũi tiêm" />
        <Stat value={pkg.vaccineCount} label="loại vắc xin" />
      </div>
      <div className="mx-3 mt-3 flex flex-wrap items-baseline gap-1.5 desk:mx-[18px] desk:mt-4 desk:gap-2.5">
        <span className="text-xl font-bold text-brand-600 desk:text-2xl">{formatVnd(pkg.price)}</span>
        <s className="text-xs text-subtle desk:text-[13.5px]">{formatVnd(pkg.originalPrice)}</s>
        <span className="rounded-lg bg-warn-soft px-2 py-0.5 text-[11px] font-bold text-warn desk:text-xs">
          -{discountPercent(pkg.price, pkg.originalPrice)}%
        </span>
      </div>
      <div className="mx-3 mt-auto mb-3 grid grid-cols-[1fr_1.2fr] gap-1.5 pt-3 desk:mx-[18px] desk:mb-[18px] desk:gap-2 desk:pt-4">
        <ButtonLink href={`/goi-vac-xin/${pkg.slug}`} variant="secondary" className="h-10 px-2 text-[13px] desk:h-11 desk:text-[15px]">
          Chi tiết
        </ButtonLink>
        <ButtonLink href={bookingHref(pkg.slug)} className="h-10 px-2 text-[13px] desk:h-11 desk:text-[15px]">
          Đặt lịch
        </ButtonLink>
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex-1 rounded-[10px] bg-surface px-2.5 py-1.5 text-xs leading-tight text-subtle desk:px-3 desk:py-2 desk:text-[12.5px]">
      <b className="block text-base text-brand-800 desk:text-lg">{value}</b>
      {label}
    </span>
  );
}
