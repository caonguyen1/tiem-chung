import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { RecommendTool } from "@/components/vaccine/recommend-tool";
import { getAgeGroups, getPackages, getRecommendationRules, getVaccines } from "@/lib/data/catalog";
import { getArticles, getCenters } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Tôi nên tiêm gì?",
  description: "Chọn độ tuổi và giới tính để xem vắc xin và gói vắc xin gợi ý tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function RecommendPage() {
  const [ageGroups, rules, vaccines, packages, centers, articles, settings] = await Promise.all([
    getAgeGroups(),
    getRecommendationRules(),
    getVaccines(),
    getPackages(),
    getCenters(),
    getArticles(4),
    getSiteSettings(),
  ]);
  const chatUrl = settings.social.find((item) => item.network === "zalo")?.href ?? "";
  return (
    <main className="flex-1">
      <PageHeader title="Tôi nên tiêm gì?" description="Chọn độ tuổi và giới tính, chúng tôi gợi ý vắc xin và gói vắc xin phù hợp." crumbs={[{ label: "Tôi nên tiêm gì?" }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <RecommendTool ageGroups={ageGroups} rules={rules} vaccines={vaccines} packages={packages} centers={centers} articles={articles} chatUrl={chatUrl} />
        </div>
      </section>
    </main>
  );
}
