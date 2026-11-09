import type { Metadata } from "next";

import { ArticleCard } from "@/components/site/article-card";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { getPromotions } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  description: "Các chương trình khuyến mãi tiêm chủng tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function PromotionsPage() {
  const promotions = await getPromotions();
  return (
    <main className="flex-1">
      <PageHeader art="promo" title="Khuyến mãi" description="Các chương trình ưu đãi đang áp dụng tại Tâm Trí." crumbs={[{ label: "Khuyến mãi" }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          {promotions.length === 0 ? (
            <div className="rounded-box bg-white px-4 py-14 text-center">
              <p className="text-lg font-bold text-brand-800">Hiện chưa có chương trình khuyến mãi</p>
              <p className="mt-1 text-subtle">Bạn quay lại sau nhé, hoặc xem các gói vắc xin hiện có.</p>
              <ButtonLink href="/goi-vac-xin" className="mt-4">
                Xem gói vắc xin
              </ButtonLink>
            </div>
          ) : (
            <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-3 desk:gap-5">
              {promotions.map((promotion) => (
                <li key={promotion.slug}>
                  <ArticleCard article={promotion} href={`/khuyen-mai/${promotion.slug}`} category="Khuyến mãi" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
