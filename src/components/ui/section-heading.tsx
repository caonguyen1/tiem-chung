import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import type { ReactNode } from "react";

import { isNavigable } from "@/lib/routes";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, action, tone = "light", className = "" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={`mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide ${dark ? "text-sun-300" : "text-brand-500"}`}>
            <span className="brand-stripe inline-block h-2 w-6 rounded-full" />
            {eyebrow}
          </p>
        )}
        <h2 className={`text-[24px] leading-tight font-bold tracking-tight text-balance md:text-4xl ${dark ? "text-white" : "text-brand-800"}`}>
          {title}
        </h2>
        {description && <p className={`mt-3 hidden text-base text-pretty md:block ${dark ? "text-brand-100" : "text-muted"}`}>{description}</p>}
      </div>
      {/* "See all" links only appear once the listing page exists. */}
      {action && isNavigable(action.href) && (
        <AppLink
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold ${dark ? "text-white" : "text-brand-600"}`}
        >
          {action.label}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </AppLink>
      )}
    </div>
  );
}
