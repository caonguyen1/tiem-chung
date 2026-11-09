"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { HeroBanner as Banner } from "@/content/types";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

const INTERVAL_MS = 6000;

/**
 * Main banner (layout C §5): finished artwork, desktop 800:420 and mobile 343:440.
 * The artwork leaves room for the HTML buttons (bottom-left on desktop, bottom strip
 * on mobile) and the slide dots (bottom-right on desktop, top-right on mobile).
 */
export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive((active + 1) % banners.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, banners.length]);

  return (
    <div className="relative overflow-hidden rounded-box" aria-roledescription="carousel" aria-label="Banner">
      <div className="grid grid-cols-1">
        {banners.map((banner, index) => {
          const current = index === active;
          const pictures = (
            <>
              <Image
                src={banner.imageMobile}
                alt={banner.alt}
                width={1029}
                height={1320}
                sizes="100vw"
                priority={index === 0}
                className="aspect-[343/440] w-full object-cover tab:hidden"
              />
              <Image
                src={banner.imageDesktop}
                alt={banner.alt}
                width={1600}
                height={840}
                sizes="(min-width: 1232px) 790px, (min-width: 901px) 66vw, 100vw"
                priority={index === 0}
                className="hidden aspect-[800/420] w-full object-cover tab:block"
              />
            </>
          );
          return (
            <div
              key={banner.id}
              aria-hidden={!current}
              inert={!current}
              className={`relative col-start-1 row-start-1 transition-opacity duration-700 ${current ? "z-[1] opacity-100" : "opacity-0"}`}
            >
              {banner.actions ? (
                <>
                  {pictures}
                  <div className="absolute inset-x-4 bottom-4 flex gap-2 tab:inset-x-auto tab:bottom-[7.2%] tab:left-[5.5%] tab:gap-2.5">
                    {banner.actions.map((action, actionIndex) => {
                      const primary = actionIndex === banner.actions!.length - 1;
                      return (
                        <ButtonLink
                          key={action.href}
                          href={action.href}
                          variant={primary ? "primary" : "secondary"}
                          className={`h-[42px] flex-1 text-[13.5px] tab:h-12 tab:flex-none tab:text-base ${primary ? "pr-1.5 pl-4 tab:pr-[7px] tab:pl-6" : "px-4 tab:px-[26px]"}`}
                        >
                          {action.label}
                          {primary && (
                            <span className="grid size-[30px] place-items-center rounded-full bg-white text-brand-600 tab:size-[34px]">
                              <ChevronRight className="size-4" />
                            </span>
                          )}
                        </ButtonLink>
                      );
                    })}
                  </div>
                </>
              ) : (
                <AppLink href={banner.href} className="block">
                  {pictures}
                </AppLink>
              )}
            </div>
          );
        })}
      </div>
      {banners.length > 1 && (
        <div className="absolute top-5 right-4 z-[2] flex gap-1.5 rounded-lg bg-black/18 px-[7px] py-[5px] tab:top-auto tab:right-[22px] tab:bottom-3.5 tab:px-2.5 tab:py-1.5">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Xem banner ${index + 1}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all tab:h-2 ${index === active ? "w-4 bg-white tab:w-6" : "w-1.5 bg-white/60 tab:w-2"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
