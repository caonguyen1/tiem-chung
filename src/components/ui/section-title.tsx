import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { isNavigable } from "@/lib/routes";

import { AppLink } from "./app-link";

type SectionTitleProps = {
  title: ReactNode;
  /** Hidden on phones (layout C). */
  description?: string;
  /** "Xem tất cả ›": shown only once the target page exists. */
  action?: { label: string; href: string };
  /** Right-hand content instead of the link, e.g. tabs. */
  aside?: ReactNode;
  className?: string;
};

/** Layout C section heading: half-yellow, half-blue bar, title, optional link or tabs on the right. */
export function SectionTitle({ title, description, action, aside, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-3 flex items-center justify-between gap-2 tab:mb-5 desk:mb-7 desk:gap-6 ${className}`}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-xl leading-tight font-bold text-brand-800 tab:text-[26px] desk:gap-3 desk:text-[32px]">
          <span
            aria-hidden="true"
            className="h-[22px] w-[5px] shrink-0 rounded-full bg-linear-to-b from-sun-400 from-50% to-brand-bright to-50% desk:h-[30px] desk:w-2"
          />
          {title}
        </h2>
        {description && <p className="mt-1 hidden text-[15px] text-subtle tab:block">{description}</p>}
      </div>
      {aside}
      {action && isNavigable(action.href) && (
        <AppLink href={action.href} className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold whitespace-nowrap text-link tab:text-[15px]">
          {action.label}
          <ChevronRight className="size-4" />
        </AppLink>
      )}
    </div>
  );
}
