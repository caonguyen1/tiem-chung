import type { ReactNode } from "react";

import { BookingDialog } from "@/components/booking/booking-dialog";
import { ConsultDialog } from "@/components/consult/consult-dialog";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getPackages, getVaccines } from "@/lib/data/catalog";
import { getCenters } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

/**
 * Shell shared by every public page in layout C: header, footer and the two popups
 * (`#dat-lich`, `#tu-van`). Each page renders its own `<main>`.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, vaccines, packages, centers] = await Promise.all([getSiteSettings(), getVaccines(), getPackages(), getCenters()]);
  return (
    <div className="isolate flex min-h-full flex-col bg-surface">
      <Header menu={settings.headerMenu} siteName={settings.shortName} />
      {children}
      <Footer />
      <ConsultDialog />
      <BookingDialog vaccines={vaccines} packages={packages} centers={centers} />
    </div>
  );
}
