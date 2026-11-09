import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/site/article-view";
import { ButtonLink } from "@/components/ui/button-link";
import { getArticleCategories, getArticleDetail, getArticles, getOutbreakAlerts, getPromotions } from "@/lib/data/content";
import { BOOKING_HASH } from "@/lib/routes";

export async function generateStaticParams() {
  const [articles, alerts] = await Promise.all([getArticles(500), getOutbreakAlerts()]);
  return [...articles.map((article) => article.slug), ...alerts.map((alert) => alert.id)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/kien-thuc/bai-viet/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleDetail(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/kien-thuc/bai-viet/[slug]">) {
  const { slug } = await params;
  const [article, articles, categories, promotions] = await Promise.all([getArticleDetail(slug), getArticles(500), getArticleCategories(), getPromotions()]);
  // Promotions live under /khuyen-mai.
  if (!article || promotions.some((promotion) => promotion.slug === slug)) notFound();
  const categoryName = new Map(categories.map((category) => [category.slug, category.name]));
  const related = articles.filter((item) => item.slug !== slug && item.categorySlug === article.categorySlug);

  return (
    <ArticleView
      article={article}
      crumbs={[
        { label: "Kiến thức tiêm chủng", href: "/kien-thuc" },
        ...(article.categorySlug ? [{ label: article.categoryName, href: `/kien-thuc/${article.categorySlug}` }] : []),
        { label: article.title },
      ]}
      related={(related.length >= 2 ? related : articles.filter((item) => item.slug !== slug)).slice(0, 4)}
      relatedTitle="Bài viết liên quan"
      relatedHref={(item) => `/kien-thuc/bai-viet/${item.slug}`}
      relatedCategory={(item) => categoryName.get(item.categorySlug)}
      actions={
        <>
          <ButtonLink href="/vac-xin" variant="secondary">
            Xem vắc xin
          </ButtonLink>
          <ButtonLink href={BOOKING_HASH}>Đặt lịch tiêm</ButtonLink>
        </>
      }
    />
  );
}
