import { TriangleAlert } from "lucide-react";

import type { OutbreakAlert } from "@/content/types";

import { BrandIconByName, type BrandIconName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";

// Icon per alert; alerts without one fall back to the generic virus icon.
const icons: Record<string, BrandIconName> = {
  "sot-xuat-huyet": "mosquito",
  "cum-mua": "influenza",
  "tay-chan-mieng": "hand",
  soi: "rash",
};

/**
 * Outbreak alerts (layout C §4): two navy cards beside the banner on desktop and tablet,
 * a one-line marquee with a fixed "Cảnh báo dịch" label on phones. Hidden when empty.
 */
export function OutbreakPanel({ alerts }: { alerts: OutbreakAlert[] }) {
  if (alerts.length === 0) return null;
  const cards = alerts.slice(0, 2);

  return (
    <aside aria-label="Cảnh báo dịch">
      <div className="hidden h-full flex-col gap-3 rounded-box bg-white p-3 tab:grid tab:grid-cols-2 tab:gap-2.5 desk:flex desk:p-[18px]">
        <h2 className="col-span-full flex items-center gap-2 text-[17px] font-bold text-warn">
          <TriangleAlert className="size-5" />
          Cảnh báo dịch
        </h2>
        {cards.map((alert, index) => (
          <AppLink
            key={alert.id}
            href={alert.href}
            className={`dots-overlay flex min-h-36 flex-1 flex-col justify-end overflow-hidden rounded-xl p-3.5 text-white desk:p-[18px] ${
              index === 0 ? "bg-linear-140 from-brand-bright to-brand-600 to-75%" : "bg-linear-140 from-brand-500 to-brand-800 to-80%"
            }`}
          >
            <BrandIconByName name={icons[alert.id] ?? "virus"} disc="white" className="absolute top-3 right-3 size-12 desk:size-[76px]" />
            <span className="w-fit rounded-lg bg-white/22 px-2.5 py-0.5 text-xs font-bold">{alert.tag}</span>
            <b className="mt-2 text-[15px] leading-tight desk:text-lg">{alert.title}</b>
            <span className="text-[13.5px] opacity-90">{alert.teaser}</span>
          </AppLink>
        ))}
      </div>

      {/* Phones: one scrolling line; the track holds the list twice so it loops seamlessly. */}
      <div className="flex h-10 items-center overflow-hidden rounded-lg bg-white ring-1 ring-warn-soft ring-inset tab:hidden">
        <b className="relative z-[1] flex h-full shrink-0 items-center gap-1.5 bg-warn-soft px-3 text-[13px] text-warn">
          <TriangleAlert className="size-4" />
          Cảnh báo dịch
        </b>
        <div className="flex shrink-0 animate-[marquee_22s_linear_infinite] motion-reduce:animate-[marquee_60s_linear_infinite]" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center pl-4 text-[13px] font-bold whitespace-nowrap text-brand-800">
              {alerts.map((alert) => (
                <span key={alert.id} className="flex items-center">
                  {alert.title}
                  <i className="mx-4 size-[5px] rounded-full bg-warn" />
                </span>
              ))}
            </span>
          ))}
        </div>
        <span className="sr-only">{alerts.map((alert) => alert.title).join(". ")}</span>
      </div>
    </aside>
  );
}
