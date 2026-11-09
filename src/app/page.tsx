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
import { getAgeGroups, getDiseaseGroups, getPackages, getRecommendationRules, getVaccines } from "@/lib/data/catalog";
import { getArticleCategories, getArticles, getBanners, getCenters, getOutbreakAlerts, getWelcomePopup } from "@/lib/data/content";
import { getSiteSettings, getWhyChooseUs } from "@/lib/data/settings";

/*
 * Homepage in layout C (docs/design/layout-c.md), approved by the client on
 * 2026-11-04. All content comes from the database through src/lib/data.
 */
export default async function HomePage() {
  const [settings, banners, promo, popup, alerts, groups, vaccines, packages, why, articles, categories, ageGroups, rules, centers] = await Promise.all([
    getSiteSettings(),
    getBanners("hero"),
    getBanners("promo"),
    getWelcomePopup(),
    getOutbreakAlerts(),
    getDiseaseGroups(),
    getVaccines(),
    getPackages(),
    getWhyChooseUs(),
    getArticles(4),
    getArticleCategories(),
    getAgeGroups(),
    getRecommendationRules(),
    getCenters(),
  ]);

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <Header menu={settings.headerMenu} siteName={settings.shortName} />
      <main className="flex-1">
        <section className="pt-4 desk:pt-6">
          <div className="container-site">
            <div className="grid grid-cols-1 gap-3 desk:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] desk:gap-5">
              <HeroBanner banners={banners} />
              <OutbreakPanel alerts={alerts} />
            </div>
            <UspStrip items={why} />
          </div>
        </section>
        <QuickLinks />
        <VaccineByDisease groups={groups.filter((group) => group.featured)} vaccines={vaccines} />
        <PackagesSection packages={packages} />
        {promo[0] && <OfferBanner banner={promo[0]} />}
        <WhySection items={why} />
        <RecommendSection ageGroups={ageGroups} rules={rules} vaccines={vaccines} packages={packages} />
        <KnowledgeGrid articles={articles} categories={categories} />
        <FaqContact />
      </main>
      <Footer />
      {popup && <WelcomePopup popup={popup} />}
      <ConsultDialog />
      <BookingDialog vaccines={vaccines} packages={packages} centers={centers} />
    </div>
  );
}
