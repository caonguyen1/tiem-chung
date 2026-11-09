import type { Metadata } from "next";
import Image from "next/image";

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
  const [featured, ...rest] = articles;
  const categoryName = new Map(categories.map((category) => [category.slug, category.name]));
  const count = (slug: string) => articles.filter((article) => article.categorySlug === slug).length;

  return (
    <main className="flex-1">
      <PageHeader art="knowledge" title="Kiến thức tiêm chủng" description="Thông tin dễ hiểu về tiêm chủng và chăm sóc sức khỏe cho cả gia đình." crumbs={[{ label: "Kiến thức tiêm chủng" }]} />

      {featured && (
        <section className="py-4 tab:py-6 desk:py-8">
          <div className="container-site">
            <SectionTitle title="Bài nổi bật" />
            <AppLink href={`/kien-thuc/bai-viet/${featured.slug}`} className="grid overflow-hidden rounded-box border border-line bg-white desk:grid-cols-[1.2fr_1fr]">
              <Image src={featured.image} alt="" width={1200} height={750} sizes="(min-width: 901px) 700px, 100vw" priority className="aspect-[16/10] w-full object-cover desk:aspect-auto desk:h-full" />
              <div className="flex flex-col justify-center p-4 tab:p-7 desk:p-9">
                <span className="w-fit rounded-full bg-surface px-3 py-1 text-xs font-bold text-brand-600">{categoryName.get(featured.categorySlug)}</span>
                <h2 className="mt-2 text-xl leading-tight font-bold text-brand-800 tab:text-2xl desk:text-[30px]">{featured.title}</h2>
                <p className="mt-2 line-clamp-3 text-[15px] text-body desk:text-base">{featured.excerpt}</p>
              </div>
            </AppLink>
          </div>
        </section>
      )}

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
            {rest.map((article) => (
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
