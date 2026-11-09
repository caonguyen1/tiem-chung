import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/site/article-card";
import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { getArticleCategories, getArticles } from "@/lib/data/content";

export async function generateStaticParams() {
  return (await getArticleCategories()).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kien-thuc/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getArticleCategories()).find((item) => item.slug === slug);
  return category ? { title: category.name, description: `Bài viết chuyên mục ${category.name} của Trung tâm Tiêm chủng Tâm Trí.` } : {};
}

export default async function KnowledgeCategoryPage({ params }: PageProps<"/kien-thuc/[category]">) {
  const { category: slug } = await params;
  const [categories, articles] = await Promise.all([getArticleCategories(), getArticles(500)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const list = articles.filter((article) => article.categorySlug === slug);

  return (
    <main className="flex-1">
      <PageHeader title={category.name} description={`${list.length} bài viết`} crumbs={[{ label: "Kiến thức tiêm chủng", href: "/kien-thuc" }, { label: category.name }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 tab:mx-0 tab:flex-wrap tab:overflow-visible tab:px-0">
            {categories.map((item) => (
              <li key={item.slug} className="shrink-0">
                <AppLink
                  href={`/kien-thuc/${item.slug}`}
                  aria-current={item.slug === slug ? "page" : undefined}
                  className={`block rounded-full border px-4 py-2 text-[13px] font-bold tab:text-sm ${item.slug === slug ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-brand-800 hover:border-brand-bright"}`}
                >
                  {item.name}
                </AppLink>
              </li>
            ))}
          </ul>
          {list.length === 0 ? (
            <p className="mt-4 rounded-box bg-white px-4 py-14 text-center text-subtle">Chuyên mục này chưa có bài viết.</p>
          ) : (
            <ul className="mt-4 grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
              {list.map((article) => (
                <li key={article.slug}>
                  <ArticleCard article={article} href={`/kien-thuc/bai-viet/${article.slug}`} category={category.name} showViews />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
