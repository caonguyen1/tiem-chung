"use client";

import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { OutbreakAlert } from "@/content/types";

import { AppLink } from "../ui/app-link";

const INTERVAL_MS = 5000;

const levelDot: Record<OutbreakAlert["level"], string> = {
  high: "bg-alert",
  watch: "bg-sun-500",
};

/** Rotates through every active outbreak alert, one line at a time. */
export function OutbreakTicker({ alerts }: { alerts: OutbreakAlert[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((index: number) => setActive((index + alerts.length) % alerts.length), [alerts.length]);

  useEffect(() => {
    if (paused || alerts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, go, alerts.length]);

  if (alerts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Cảnh báo dịch bệnh"
      className="flex items-stretch gap-3 border-b border-sun-200 bg-sun-50 py-2.5 pr-2 pl-3 md:gap-4 md:pl-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span className="flex shrink-0 items-center gap-1.5 self-center rounded-full bg-alert py-1 pr-1 pl-2.5 text-[12px] font-bold tracking-wide text-white uppercase">
        <AlertTriangle className="size-3.5" />
        <span className="hidden sm:inline">Cảnh báo dịch</span>
        <span className="grid size-5 place-items-center rounded-full bg-white text-[11px] text-alert">{alerts.length}</span>
      </span>

      {/* Every alert stays in the DOM so screen readers can read the full list. */}
      <ul className="relative grid min-w-0 flex-1 overflow-hidden">
        {alerts.map((alert, index) => {
          const offset = index - active;
          return (
            <li
              key={alert.id}
              aria-hidden={offset !== 0}
              className={`col-start-1 row-start-1 flex min-w-0 items-center transition-all duration-500 ease-out ${
                offset === 0 ? "translate-y-0 opacity-100" : offset < 0 ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
              }`}
            >
              <AppLink
                href={alert.href}
                tabIndex={offset === 0 ? undefined : -1}
                className="flex min-w-0 items-start gap-2 text-[14px] leading-snug md:items-center"
              >
                <span className={`mt-1.5 size-2 shrink-0 rounded-full md:mt-0 ${levelDot[alert.level]}`} />
                <span className="line-clamp-2 min-w-0 md:line-clamp-1">
                  <strong className="font-semibold text-ink">{alert.title}.</strong>{" "}
                  <span className="text-muted">{alert.summary}</span>
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>

      {alerts.length > 1 && (
        <div className="flex shrink-0 items-center gap-0.5 self-center">
          <span className="mr-1 hidden text-[13px] font-medium text-muted tabular-nums sm:inline">
            {active + 1}/{alerts.length}
          </span>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Cảnh báo trước"
            className="grid size-8 place-items-center rounded-full text-brand-700 transition hover:bg-sun-100"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Cảnh báo tiếp theo"
            className="grid size-8 place-items-center rounded-full text-brand-700 transition hover:bg-sun-100"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
