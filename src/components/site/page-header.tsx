import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { AppLink } from "../ui/app-link";

export type Crumb = { label: string; href?: string };

/** Trail above the page title: Trang chủ › … › current page. */
export function Breadcrumb({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const trail: Crumb[] = [{ label: "Trang chủ", href: "/" }, ...items];
  const color = tone === "light" ? "text-white/80" : "text-subtle";
  return (
    <nav aria-label="Đường dẫn" className={`text-[13px] tab:text-sm ${color}`}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <AppLink href={item.href} className="hover:underline">
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
 * Banner at the top of every inner page (layout C): navy gradient with the dot texture, the
 * breadcrumb, the title and an optional line and actions. No photo, so it works at any width.
 */
export function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: ReactNode;
  description?: string;
  crumbs: Crumb[];
  /** Buttons or filters placed under the description. */
  children?: ReactNode;
}) {
  return (
    <section className="pt-4 desk:pt-6">
      <div className="container-site">
        <div className="dots-overlay relative overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright px-4 py-5 text-white tab:px-7 tab:py-7 desk:px-10 desk:py-9">
          <div className="relative z-[1]">
            <Breadcrumb items={crumbs} tone="light" />
            <h1 className="mt-2 text-2xl leading-tight font-bold tab:text-[32px] desk:mt-3 desk:text-[40px]">{title}</h1>
            {description && <p className="mt-1.5 max-w-3xl text-sm text-white/90 tab:text-base desk:mt-2 desk:text-lg">{description}</p>}
            {children && <div className="mt-4 flex flex-wrap gap-2.5 desk:mt-5">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
