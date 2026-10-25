import { MapPin, Phone } from "lucide-react";

import { siteSettings } from "@/content/site";

import { AppLink } from "../ui/app-link";

export function TopBar() {
  return (
    <div className="hidden bg-brand-800 text-[13px] text-brand-100 xl:block">
      <div className="container-page flex h-10 items-center justify-between gap-8">
        <p className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-sun-400" />
          <span className="truncate">{siteSettings.address}</span>
        </p>
        <nav aria-label="Liên kết phụ" className="flex shrink-0 items-center gap-5 whitespace-nowrap">
          {siteSettings.secondaryMenu.map((item) => (
            <AppLink key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </AppLink>
          ))}
          <a
            href={`tel:${siteSettings.hotline.dial}`}
            className="flex items-center gap-1.5 rounded-full bg-sun-400 px-3 py-1 font-semibold text-brand-900"
          >
            <Phone className="size-3.5" />
            {siteSettings.hotline.display}
          </a>
        </nav>
      </div>
    </div>
  );
}
