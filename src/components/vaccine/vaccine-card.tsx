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
      className={`group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-4 transition duration-300 md:p-5 ${hover}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-semibold text-brand-600">{vaccine.manufacturer}</span>
        {vaccine.status === "preorder" && (
          <span className="rounded-full bg-sun-100 px-2.5 py-1 text-[12px] font-semibold text-sun-600">Đặt trước</span>
        )}
      </div>
      <h3 className="mt-3 text-[19px] leading-snug font-bold text-brand-800 md:text-xl">
        <AppLink href={detailHref} className="after:absolute after:inset-0">
          {vaccine.name}
        </AppLink>
      </h3>
      <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-muted">{vaccine.prevents}</p>
      <dl className="mt-3 space-y-1 text-[13px] text-muted">
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
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 md:pt-4">
        <p>
          <span className="block text-[12px] text-muted">Giá / liều</span>
          <span className="text-[18px] font-bold text-brand-700">{formatVnd(vaccine.price)}</span>
        </p>
        <AppLink
          href={action.href(vaccine.slug)}
          className={`${buttonClasses(vaccine.status === "consult" ? "outline" : "primary", "md")} relative z-10 h-10 px-4 text-[14px]`}
        >
          {action.label}
        </AppLink>
      </div>
    </article>
  );
}
