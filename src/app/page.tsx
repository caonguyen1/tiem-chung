import { BookingDialog } from "@/components/booking/booking-dialog";
import { ConsultDialog } from "@/components/consult/consult-dialog";
import { FaqContact } from "@/components/home/faq-contact";
import { HeroSlider } from "@/components/home/hero-slider";
import { KnowledgeSection } from "@/components/home/knowledge-section";
import { QuickAccess } from "@/components/home/quick-access";
import { RecommendBand } from "@/components/home/recommend-band";
import { VaccineFinder } from "@/components/home/vaccine-finder";
import { VaccinePackages } from "@/components/home/vaccine-packages";
import { WhyTamTri } from "@/components/home/why-tam-tri";
import { FloatingActions } from "@/components/layout/floating-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { diseaseGroups, vaccinePackages, vaccines } from "@/content/catalog";
import { articleCategories, articles } from "@/content/editorial";
import { heroBanners, outbreakAlerts } from "@/content/site";

/*
 * Section order follows the client's review (2026-10-26): find a vaccine, see
 * why Tâm Trí, and book — before anything else.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="pb-16 lg:pb-0">
        <HeroSlider banners={heroBanners} />
        <QuickAccess alerts={outbreakAlerts} />
        <VaccineFinder groups={diseaseGroups.filter((group) => group.featured)} vaccines={vaccines} />
        <VaccinePackages packages={vaccinePackages} />
        <WhyTamTri />
        <RecommendBand />
        <KnowledgeSection articles={articles} categories={articleCategories} />
        <FaqContact />
      </main>
      <SiteFooter />
      <FloatingActions />
      <ConsultDialog />
      <BookingDialog />
    </>
  );
}
