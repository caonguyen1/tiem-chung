import Image from "next/image";

import { siteSettings } from "@/content/site";

import { AppLink } from "../ui/app-link";
import { Wave } from "../ui/wave";
import { SocialLinks } from "./social-links";

/** Layout C footer: navy, joined to the page above by a curve; logo, switchboard and social first. */
export function Footer() {
  const { footerColumns, hotlineLines, hotlineHours, social, address, name, slogan } = siteSettings;
  return (
    <footer className="relative bg-brand-800 pt-[52px] pb-4 text-[13px] text-brand-200 tab:pt-14 tab:pb-5 tab:text-[14.5px] desk:pt-[84px] desk:pb-7">
      <Wave edge="top" className="text-surface" />
      <div className="relative z-[2] container-site">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 tab:gap-x-5 tab:gap-y-6 desk:grid-cols-[1.4fr_1fr_1fr_1fr] desk:gap-12">
          <div>
            <Image src="/images/logo-horizontal-white.png" alt={name} width={900} height={299} className="h-9 w-auto desk:h-12" />
            <p className="mt-3 max-w-[300px] desk:mt-4">{slogan}. Thuộc hệ thống Y tế Tâm Trí, Quy Nhơn.</p>
            <p className="mt-3 text-brand-100 desk:mt-3.5">
              Tổng đài <b className="text-sun-400">{hotlineLines[0]?.dial}</b> ({hotlineHours})
            </p>
            <div className="mt-2.5">
              <SocialLinks items={social} tone="dark" />
            </div>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-2 text-sm font-bold text-white desk:mb-3.5 desk:text-[15.5px]">{column.title}</h2>
              <ul className="grid gap-1.5 desk:gap-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <AppLink href={item.href}>{item.label}</AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-white/12 pt-3 text-xs tab:mt-7 tab:flex-row tab:justify-between tab:pt-4 tab:text-[13.5px] desk:mt-11 desk:pt-[22px]">
          <span>© 2026 {name}</span>
          <span>{address}</span>
        </div>
      </div>
    </footer>
  );
}
