import { BookingDialog } from "@/components/booking/booking-dialog";
import { ConsultDialog } from "@/components/consult/consult-dialog";
import { FaqContact } from "@/components/homepage/faq-contact";
import { HeroBanner } from "@/components/homepage/hero-banner";
import { KnowledgeGrid } from "@/components/homepage/knowledge-grid";
import { OfferBanner } from "@/components/homepage/offer-banner";
import { OutbreakPanel } from "@/components/homepage/outbreak-panel";
import { PackagesSection } from "@/components/homepage/packages-section";
import { QuickLinks } from "@/components/homepage/quick-links";
import { RecommendSection } from "@/components/homepage/recommend-section";
import { UspStrip } from "@/components/homepage/usp-strip";
import { VaccineByDisease } from "@/components/homepage/vaccine-by-disease";
import { WelcomePopup } from "@/components/homepage/welcome-popup";
import { WhySection } from "@/components/homepage/why-section";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { diseaseGroups, vaccinePackages, vaccines } from "@/content/catalog";
import { articleCategories, articles } from "@/content/editorial";
import { homeBanners, outbreakAlerts, promoBanner, welcomePopup } from "@/content/site";

/*
 * Homepage in layout C (docs/design/layout-c.md), approved by the client on
 * 2026-11-04 with the fixes from their 2026-11-03 notes.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <section className="pt-4 desk:pt-6">
          <div className="container-site">
            <div className="grid grid-cols-1 gap-3 desk:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] desk:gap-5">
              <HeroBanner banners={homeBanners} />
              <OutbreakPanel alerts={outbreakAlerts} />
            </div>
            <UspStrip />
          </div>
        </section>
        <QuickLinks />
        <VaccineByDisease groups={diseaseGroups.filter((group) => group.featured)} vaccines={vaccines} />
        <PackagesSection packages={vaccinePackages} />
        <OfferBanner banner={promoBanner} />
        <WhySection />
        <RecommendSection />
        <KnowledgeGrid articles={articles} categories={articleCategories} />
        <FaqContact />
      </main>
      <Footer />
      <WelcomePopup popup={welcomePopup} />
      <ConsultDialog />
      <BookingDialog />
    </div>
  );
}
