"use client";

import { ChevronRight, Menu, Phone, X } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { useEffect, useState } from "react";

import { siteSettings } from "@/content/site";

import { buttonClasses } from "../ui/button-link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label="Mở menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50"
      >
        <Menu className="size-6" />
      </button>

      {/* The clipping wrapper keeps the off-canvas panel from widening the page. */}
      <div className={`fixed inset-0 z-50 overflow-hidden ${open ? "" : "pointer-events-none invisible delay-300"}`}>
      <div
        className={`absolute inset-0 bg-brand-950/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        aria-label="Menu"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="font-semibold text-brand-800">Danh mục</span>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-full text-brand-700 hover:bg-brand-50"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {siteSettings.mainMenu.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[16px] font-medium text-ink hover:bg-brand-50"
            >
              {item.label}
              <ChevronRight className="size-4 text-brand-300" />
            </AppLink>
          ))}
          <div className="my-4 h-px bg-line" />
          {siteSettings.secondaryMenu.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-[15px] text-muted hover:bg-brand-50"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>
        <div className="grid gap-2 border-t border-line p-4">
          <AppLink href="/dat-hen" onClick={() => setOpen(false)} className={buttonClasses("primary", "md")}>
            Đặt hẹn tiêm
          </AppLink>
          <a href={`tel:${siteSettings.hotline.dial}`} className={buttonClasses("outline", "md")}>
            <Phone className="size-4" /> Tổng đài {siteSettings.hotline.display}
          </a>
        </div>
      </aside>
      </div>
    </div>
  );
}
