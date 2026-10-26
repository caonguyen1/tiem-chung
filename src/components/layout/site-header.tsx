import { CalendarCheck, Search } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";

import { siteSettings } from "@/content/site";

import { ButtonLink } from "../ui/button-link";
import { MobileNav } from "./mobile-nav";
import { TopBar } from "./top-bar";

export function SiteHeader() {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center gap-4 lg:h-20">
          <AppLink href="/" className="shrink-0" aria-label={siteSettings.name}>
            <Image
              src="/images/logo-horizontal.png"
              alt={siteSettings.name}
              width={900}
              height={299}
              preload
              className="h-11 w-auto lg:h-14"
            />
          </AppLink>

          <nav aria-label="Menu chính" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {siteSettings.mainMenu.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className="rounded-full px-3 py-2 text-[15px] font-medium whitespace-nowrap text-ink transition hover:bg-brand-50 hover:text-brand-600"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <AppLink
              href="#tra-cuu-vac-xin"
              aria-label="Tìm vắc xin"
              className="grid size-10 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50"
            >
              <Search className="size-5" />
            </AppLink>
            <ButtonLink href="#dat-lich" size="sm" className="px-3.5 lg:h-11 lg:px-5">
              <CalendarCheck className="size-4" />
              Đặt hẹn
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
