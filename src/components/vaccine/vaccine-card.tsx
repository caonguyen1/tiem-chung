import { Globe2, UserRound } from "lucide-react";

import { AppLink } from "@/components/ui/app-link";
import type { Vaccine, VaccineStatus } from "@/content/types";
import { formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH, isNavigable } from "@/lib/routes";

import { buttonClasses } from "../ui/button-link";

const statusAction: Record<VaccineStatus, { label: string; href: (slug: string) => string }> = {
  book: { label: "Đặt lịch", href: (slug) => bookingHref(slug) },
  preorder: { label: "Đặt trước", href: (slug) => bookingHref(slug) },
  consult: { label: "Cần tư vấn", href: () => CONSULT_HASH },
};

export function VaccineCard({ vaccine }: { vaccine: Vaccine }) {
  const action = statusAction[vaccine.status];
  const detailHref = `/vac-xin/${vaccine.slug}`;
  const hover = isNavigable(detailHref) ? "hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift" : "";
  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border border-line bg-white p-3.5 transition duration-300 md:rounded-[var(--radius-card)] md:p-5 ${hover}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600 md:px-2.5 md:py-1 md:text-[12px]">{vaccine.manufacturer}</span>
        {vaccine.status === "preorder" && (
          <span className="rounded-full bg-sun-100 px-2 py-0.5 text-[11px] font-semibold text-sun-600 md:px-2.5 md:py-1 md:text-[12px]">Đặt trước</span>
        )}
      </div>
      <h3 className="mt-2 text-[17px] leading-snug font-bold text-brand-800 md:mt-3 md:text-xl">
        <AppLink href={detailHref} className="after:absolute after:inset-0">
          {vaccine.name}
        </AppLink>
      </h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted md:text-[14px] md:leading-relaxed">{vaccine.prevents}</p>
      <dl className="mt-2 space-y-0.5 text-[12px] text-muted md:mt-3 md:space-y-1 md:text-[13px]">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Xuất xứ</dt>
          <Globe2 className="size-3.5 shrink-0 text-brand-400" />
          <dd>{vaccine.origin}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Đối tượng</dt>
          <UserRound className="size-3.5 shrink-0 text-brand-400" />
          <dd className="line-clamp-1">{vaccine.audience}</dd>
        </div>
      </dl>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 md:gap-3 md:border-t md:border-line md:pt-4">
        <p>
          <span className="block text-[11px] text-muted md:text-[12px]">Giá / liều</span>
          <span className="text-[16px] font-bold text-brand-700 md:text-[18px]">{formatVnd(vaccine.price)}</span>
        </p>
        <AppLink
          href={action.href(vaccine.slug)}
          className={`${buttonClasses(vaccine.status === "consult" ? "outline" : "primary", "md")} relative z-10 h-9 px-3.5 text-[13px] shadow-none md:h-10 md:px-4 md:text-[14px]`}
        >
          {action.label}
        </AppLink>
      </div>
    </article>
  );
}
