import type { Metadata } from "next";

import { ArticleCard } from "@/components/site/article-card";
import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { SectionTitle } from "@/components/ui/section-title";
import { getArticleCategories, getArticles } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Kiến thức tiêm chủng",
  description: "Bài viết về tiêm chủng, chăm sóc sức khỏe mẹ và bé do bác sĩ Tâm Trí kiểm duyệt.",
};

export default async function KnowledgePage() {
  const [articles, categories] = await Promise.all([getArticles(500), getArticleCategories()]);
  const categoryName = new Map(categories.map((category) => [category.slug, category.name]));
  const count = (slug: string) => articles.filter((article) => article.categorySlug === slug).length;

  return (
    <main className="flex-1">
      <PageHeader art="knowledge" title="Kiến thức tiêm chủng" description="Thông tin dễ hiểu về tiêm chủng và chăm sóc sức khỏe cho cả gia đình." crumbs={[{ label: "Kiến thức tiêm chủng" }]} />

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <SectionTitle title="Chuyên mục" />
          <ul className="grid grid-cols-2 gap-2.5 tab:grid-cols-3 desk:grid-cols-6 desk:gap-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <AppLink href={`/kien-thuc/${category.slug}`} className="block h-full rounded-xl border border-line bg-white p-3.5 hover:border-brand-bright desk:p-4">
                  <b className="block text-[15px] leading-tight text-brand-800 desk:text-base">{category.name}</b>
                  <span className="mt-1 block text-[13px] text-subtle">{count(category.slug)} bài viết</span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <SectionTitle title="Bài viết mới" />
          <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} href={`/kien-thuc/bai-viet/${article.slug}`} category={categoryName.get(article.categorySlug)} showViews />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
