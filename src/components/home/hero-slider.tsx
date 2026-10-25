"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { HeroBanner } from "@/content/types";

import { AppLink } from "../ui/app-link";

const INTERVAL_MS = 6000;
const SWIPE_PX = 40;

/**
 * Full-artwork banner carousel. Each banner has its own desktop (1920×560) and
 * mobile (1080×1080) image; CSS shows the right one so only that one loads.
 */
export function HeroSlider({ banners }: { banners: HeroBanner[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((index: number) => setActive((index + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, go, banners.length]);

  return (
    <section aria-roledescription="carousel" aria-label="Banner nổi bật" className="md:pt-6">
      <div className="md:container-page">
        <div
          className="group relative overflow-hidden bg-brand-50 md:rounded-[1.75rem] md:shadow-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > SWIPE_PX) go(active + (delta < 0 ? 1 : -1));
            touchStartX.current = null;
          }}
        >
          <div className="grid aspect-square md:aspect-[1920/560]">
            {banners.map((banner, index) => {
              const current = index === active;
              const eager = index === 0;
              return (
                <AppLink
                  key={banner.id}
                  href={banner.href}
                  aria-hidden={!current}
                  tabIndex={current ? undefined : -1}
                  className={`relative col-start-1 row-start-1 block transition-opacity duration-700 ease-out ${
                    current ? "z-10 opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <Image
                    src={banner.imageDesktop}
                    alt={banner.alt}
                    fill
                    sizes="(min-width: 1280px) 1216px, 100vw"
                    className="hidden object-cover md:block"
                    loading={eager ? "eager" : "lazy"}
                    fetchPriority={eager ? "high" : "auto"}
                  />
                  <Image
                    src={banner.imageMobile}
                    alt={banner.alt}
                    fill
                    sizes="100vw"
                    className="object-cover md:hidden"
                    loading={eager ? "eager" : "lazy"}
                    fetchPriority={eager ? "high" : "auto"}
                  />
                </AppLink>
              );
            })}
          </div>

          {banners.length > 1 && (
            <>
              <ArrowButton direction="prev" onClick={() => go(active - 1)} />
              <ArrowButton direction="next" onClick={() => go(active + 1)} />
              {/* Bottom-right on mobile so the dots never cover the artwork's CTA (bottom-left). */}
              <div className="absolute inset-x-0 bottom-3 z-20 flex justify-end pr-4 md:bottom-4 md:justify-center md:pr-0">
                <div className="flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1.5 backdrop-blur">
                  {banners.map((banner, index) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => go(index)}
                      aria-label={`Xem banner ${index + 1}`}
                      aria-current={index === active}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === active ? "w-6 bg-brand-600" : "w-1.5 bg-brand-300 hover:bg-brand-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Banner trước" : "Banner sau"}
      className={`absolute top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-700 shadow-card transition duration-300 hover:bg-white md:grid ${
        direction === "prev" ? "left-4" : "right-4"
      }`}
    >
      <Icon className="size-5" />
    </button>
  );
}
