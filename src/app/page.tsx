import { ConsultDialog } from "@/components/consult/consult-dialog";
import { CenterNetwork } from "@/components/home/center-network";
import { Commitments } from "@/components/home/commitments";
import { DoctorsSection } from "@/components/home/doctors-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HeroSlider } from "@/components/home/hero-slider";
import { KnowledgeSection } from "@/components/home/knowledge-section";
import { QuickAccess } from "@/components/home/quick-access";
import { RecommendBand } from "@/components/home/recommend-band";
import { VaccinePackages } from "@/components/home/vaccine-packages";
import { VaccinesByDisease } from "@/components/home/vaccines-by-disease";
import { FloatingActions } from "@/components/layout/floating-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { diseaseGroups, vaccinePackages, vaccines } from "@/content/catalog";
import { articleCategories, articles, centers, doctors } from "@/content/editorial";
import { centerStats, heroBanners, outbreakAlerts } from "@/content/site";

export default function HomePage() {
  const featuredGroups = diseaseGroups.filter((group) => group.featured);

  return (
    <>
      <SiteHeader />
      <main className="pb-16 lg:pb-0">
        <HeroSlider banners={heroBanners} />
        <QuickAccess alerts={outbreakAlerts} />
        <Commitments />
        <VaccinesByDisease groups={featuredGroups.slice(0, 8)} vaccines={vaccines} />
        <VaccinePackages packages={vaccinePackages} />
        <RecommendBand />
        <DoctorsSection doctors={doctors} />
        <KnowledgeSection articles={articles} categories={articleCategories} />
        <FeaturedCategories groups={featuredGroups.slice(0, 12)} />
        <CenterNetwork centers={centers} stats={centerStats} />
      </main>
      <SiteFooter />
      <FloatingActions />
      <ConsultDialog />
    </>
  );
}
