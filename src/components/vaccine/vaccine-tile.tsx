import type { Vaccine } from "@/content/types";
import { formatVnd } from "@/lib/format";
import { vaccineAction } from "@/lib/vaccine-action";

import { VaccineVial } from "../icons/vaccine-vial";
import { ButtonLink } from "../ui/button-link";

/**
 * Layout C vaccine card: 16:9 picture with the origin tag, name, two-line
 * description, price and the status button pinned to the bottom.
 */
export function VaccineTile({ vaccine, cap = "sun" }: { vaccine: Vaccine; cap?: "sun" | "blue" }) {
  const action = vaccineAction[vaccine.status];
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative aspect-video overflow-hidden bg-linear-160 from-surface-soft to-surface-deep">
        <span className="absolute top-2.5 left-2.5 z-[1] rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-brand-800 shadow-[0_2px_6px_-2px_rgb(28_42_102/0.2)] desk:top-3 desk:left-3 desk:px-2.5 desk:text-xs">
          {vaccine.origin}
        </span>
        <VaccineVial
          label={vaccine.name.split(" ")[0]}
          cap={cap}
          className="absolute top-[6%] left-1/2 h-[88%] w-auto -translate-x-1/2 -rotate-[8deg]"
        />
      </div>
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5 desk:px-[18px] desk:pt-4 desk:pb-[18px]">
        <h3 className="text-base leading-tight font-bold text-brand-800 desk:text-[19px]">{vaccine.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-body desk:text-sm">{vaccine.prevents}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 desk:pt-3.5">
          <span className="text-base font-bold text-brand-600 desk:text-[19px]">{formatVnd(vaccine.price)}</span>
          <ButtonLink href={action.href(vaccine.slug)} size="sm" className="desk:h-10 desk:px-4">
            {action.label}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
