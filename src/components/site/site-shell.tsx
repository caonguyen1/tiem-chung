import type { ReactNode } from "react";

import { BookingDialog } from "@/components/booking/booking-dialog";
import { ConsultDialog } from "@/components/consult/consult-dialog";
import { getPackages, getVaccines } from "@/lib/data/catalog";
import { getCenters } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

import { Footer } from "./footer";
import { Header } from "./header";

/**
 * Shell shared by every public page in layout C: skip link, header, footer, the two popups
 * (`#dat-lich`, `#tu-van`) and the clinic's structured data. Used by the `(site)` layout and by
 * the 404 page. Each page renders its own `<main>` inside.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, vaccines, packages, centers] = await Promise.all([getSiteSettings(), getVaccines(), getPackages(), getCenters()]);
  const center = centers[0];
  const clinic = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: settings.name,
    description: settings.description,
    ...(settings.hotlineLines[0] && { telephone: settings.hotlineLines[0].dial }),
    ...(center && { address: center.address, openingHours: center.openingHours }),
  };
  return (
    <div className="isolate flex min-h-full flex-col bg-surface">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Bỏ qua, tới nội dung chính
      </a>
      <Header menu={settings.headerMenu} siteName={settings.shortName} />
      <div id="noi-dung" className="flex flex-1 flex-col">
        {children}
      </div>
      <Footer />
      <ConsultDialog />
      <BookingDialog vaccines={vaccines} packages={packages} centers={centers} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinic).replace(/</g, "\\u003c") }} />
    </div>
  );
}
