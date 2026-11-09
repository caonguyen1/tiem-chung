"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { NavItem } from "@/content/types";
import { BOOKING_HASH } from "@/lib/routes";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

/** Fired by the header search; the homepage vaccine finder listens and shows the matches. */
export const VACCINE_SEARCH_EVENT = "vaccine-search";

/**
 * Layout C header (client feedback 2026-11-03): one white row with the logo, the
 * menu in logo blue, a search icon that opens a compact search box, and "Đặt lịch hẹn".
 * Below 901px the menu moves into a drawer opened by the hamburger.
 */
export function Header({ menu, siteName }: { menu: NavItem[]; siteName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-20 bg-linear-to-b from-white to-surface-soft shadow-[0_1px_0_var(--color-line)]">
      <div className="container-site flex h-[58px] items-center gap-2 tab:h-16 tab:gap-2.5 desk:h-[72px] desk:gap-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Mở menu"
          aria-controls="main-menu"
          aria-expanded={menuOpen}
          className="grid size-[34px] shrink-0 place-items-center rounded-full bg-surface text-brand-600 tab:size-[38px] desk:hidden"
        >
          <Menu className="size-5" />
        </button>
        <AppLink href="/" className="shrink-0">
          <Image src="/images/logo-horizontal.png" alt={siteName} width={900} height={299} priority className="h-[30px] w-auto tab:h-[38px] desk:h-11" />
        </AppLink>

        {/* Desktop: inline menu. Mobile: off-canvas drawer with a dimmed backdrop. */}
        <nav
          id="main-menu"
          aria-label="Menu chính"
          className={`fixed inset-0 z-50 desk:static desk:z-auto desk:flex-1 ${menuOpen ? "visible" : "invisible desk:visible"}`}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-brand-900/70 transition-opacity duration-200 desk:hidden ${menuOpen ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`absolute inset-y-0 left-0 flex w-[min(300px,calc(100vw-56px))] flex-col overflow-y-auto bg-white px-5 pt-[72px] pb-5 shadow-[12px_0_36px_rgb(15_29_78/0.18)] transition-transform duration-[260ms] desk:static desk:w-auto desk:flex-row desk:justify-center desk:gap-[22px] desk:overflow-visible desk:bg-transparent desk:p-0 desk:shadow-none desk:transition-none ${menuOpen ? "translate-x-0" : "-translate-x-full desk:translate-x-0"}`}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Đóng menu"
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-[10px] bg-surface text-brand-600 desk:hidden"
            >
              <X className="size-5" />
            </button>
            {menu.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                className={`border-b border-line py-3.5 text-sm font-bold last:border-0 desk:border-0 desk:py-0 desk:text-[14.5px] desk:whitespace-nowrap ${item.highlight ? "text-warn" : "text-brand-600"}`}
              >
                {item.label}
              </AppLink>
            ))}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 desk:ml-0 desk:gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Tìm kiếm"
            aria-controls="header-search"
            aria-expanded={searchOpen}
            className={`grid size-9 place-items-center rounded-full desk:size-[42px] ${searchOpen ? "bg-brand-600 text-white" : "bg-surface text-brand-600"}`}
          >
            <Search className="size-[17px] desk:size-[19px]" />
          </button>
          <ButtonLink href={BOOKING_HASH} className="h-9 px-3 text-[13px] tab:h-10 tab:px-3.5 tab:text-sm desk:h-[42px] desk:px-5 desk:text-[15px]">
            Đặt lịch hẹn
          </ButtonLink>
        </div>
      </div>

      {searchOpen && (
        <div id="header-search" className="border-t border-line bg-white">
          <form
            role="search"
            className="container-site py-3"
            onSubmit={(event) => {
              event.preventDefault();
              const query = inputRef.current?.value.trim() ?? "";
              window.dispatchEvent(new CustomEvent(VACCINE_SEARCH_EVENT, { detail: query }));
              document.getElementById("tra-cuu-vac-xin")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <label className="mx-auto flex h-10 max-w-[560px] items-center gap-2.5 rounded-full bg-surface-soft pr-1.5 pl-3.5 ring-1 ring-line ring-inset focus-within:ring-2 focus-within:ring-brand-400 desk:h-11 desk:pl-[18px]">
              <Search className="size-[18px] shrink-0 text-brand-600" />
              <span className="sr-only">Tìm vắc xin</span>
              <input
                ref={inputRef}
                type="search"
                placeholder="Bạn cần tìm vắc xin gì?"
                className="h-full min-w-0 flex-1 bg-transparent text-base text-brand-800 outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
              />
              <button type="submit" className="h-[30px] shrink-0 rounded-full bg-brand-600 px-4 text-sm font-bold text-white desk:h-[34px]">
                Tìm
              </button>
            </label>
          </form>
        </div>
      )}
    </header>
  );
}
