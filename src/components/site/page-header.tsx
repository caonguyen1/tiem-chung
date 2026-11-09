import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import type { BrandIconName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";
import { PageArt, type PageArtName } from "./page-art";

export type Crumb = { label: string; href?: string };

/** Trail above the page title: Trang chủ › … › current page. */
export function Breadcrumb({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const trail: Crumb[] = [{ label: "Trang chủ", href: "/" }, ...items];
  const color = tone === "light" ? "text-white/80" : "text-subtle";
  const link = tone === "light" ? "" : "text-link";
  return (
    <nav aria-label="Đường dẫn" className={`text-[13px] tab:text-sm ${color}`}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <AppLink href={item.href} className={`hover:underline ${link}`}>
                  {item.label}
                </AppLink>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-bold" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Banner at the top of every inner page (layout C): full-width soft blue gradient, breadcrumb,
 * dark title with a short yellow bar, and a themed illustration on the right (hidden on phones).
 */
export function PageHeader({
  title,
  description,
  crumbs,
  art = "vaccine",
  artIcon,
  children,
}: {
  title: ReactNode;
  description?: string;
  crumbs: Crumb[];
  art?: PageArtName;
  /** Main icon when `art` is "icon" (disease group, package). */
  artIcon?: BrandIconName;
  /** Buttons or chips placed under the description. */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-110 from-white via-surface-deep to-brand-200/80">
      <div className="container-site relative">
        <div className="relative z-[1] max-w-[640px] py-6 tab:py-9 desk:min-h-[280px] desk:max-w-[620px] desk:py-12">
          <Breadcrumb items={crumbs} />
          <h1 className="mt-2.5 text-[26px] leading-tight font-bold text-brand-800 tab:text-[34px] desk:mt-4 desk:text-[44px]">{title}</h1>
          <span aria-hidden="true" className="mt-2.5 block h-1.5 w-16 rounded-full bg-sun-400 desk:mt-3.5 desk:w-24" />
          {description && <p className="mt-3 text-sm text-body tab:text-base desk:mt-4 desk:text-lg">{description}</p>}
          {children && <div className="mt-4 flex flex-wrap gap-2.5 desk:mt-5">{children}</div>}
        </div>
        <div className="absolute inset-y-0 right-4 hidden items-center desk:flex">
          <div className="h-[92%] max-h-[280px]">
            <PageArt name={art} icon={artIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}
