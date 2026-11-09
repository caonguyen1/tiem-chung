import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/site/article-view";
import { ButtonLink } from "@/components/ui/button-link";
import { getArticleDetail, getPromotions } from "@/lib/data/content";
import { BOOKING_HASH } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getPromotions()).map((promotion) => ({ slug: promotion.slug }));
}

export async function generateMetadata({ params }: PageProps<"/khuyen-mai/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleDetail(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function PromotionPage({ params }: PageProps<"/khuyen-mai/[slug]">) {
  const { slug } = await params;
  const [article, promotions] = await Promise.all([getArticleDetail(slug), getPromotions()]);
  // Only articles of a promotion category belong under /khuyen-mai.
  if (!article || !promotions.some((promotion) => promotion.slug === slug)) notFound();

  return (
    <ArticleView
      article={article}
      crumbs={[{ label: "Khuyến mãi", href: "/khuyen-mai" }, { label: article.title }]}
      related={promotions.filter((promotion) => promotion.slug !== slug).slice(0, 4)}
      relatedTitle="Chương trình khác"
      relatedHref={(item) => `/khuyen-mai/${item.slug}`}
      relatedCategory={() => "Khuyến mãi"}
      actions={
        <>
          <ButtonLink href="/goi-vac-xin" variant="secondary">
            Xem gói vắc xin
          </ButtonLink>
          <ButtonLink href={BOOKING_HASH}>Đặt lịch tiêm</ButtonLink>
        </>
      }
    />
  );
}
