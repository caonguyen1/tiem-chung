import { BadgeCheck, Eye } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";

import type { Article, ArticleCategory } from "@/content/types";
import { formatCount } from "@/lib/format";

import { SectionHeading } from "../ui/section-heading";

type Props = { articles: Article[]; categories: ArticleCategory[] };

export function KnowledgeSection({ articles, categories }: Props) {
  const [featured, ...rest] = articles;
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

  return (
    <section className="bg-canvas py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Kiến thức tiêm chủng"
          title="Hiểu đúng để tiêm đủ"
          description="Bài viết do đội ngũ bác sĩ Tâm Trí biên soạn và kiểm duyệt."
          action={{ label: "Xem tất cả bài viết", href: "/kien-thuc" }}
        />

        <ul className="no-scrollbar -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((category) => (
            <li key={category.slug} className="shrink-0">
              <AppLink
                href={`/kien-thuc/${category.slug}`}
                className="block rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium text-brand-800 transition hover:border-brand-400 hover:text-brand-600"
              >
                {category.name}
              </AppLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="group relative overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 lg:p-7">
              <ArticleMeta article={featured} category={categoryName(featured.categorySlug)} />
              <h3 className="mt-3 text-[22px] leading-snug font-bold text-brand-800 lg:text-2xl">
                <AppLink href={`/kien-thuc/bai-viet/${featured.slug}`} className="after:absolute after:inset-0">
                  {featured.title}
                </AppLink>
              </h3>
              <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-muted">{featured.excerpt}</p>
              {featured.reviewedBy && (
                <p className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-brand-600">
                  <BadgeCheck className="size-4" />
                  Kiểm duyệt bởi {featured.reviewedBy}
                </p>
              )}
            </div>
          </article>

          <ul className="grid gap-4">
            {rest.map((article) => (
              <li key={article.slug}>
                <article className="group relative flex gap-4 rounded-[var(--radius-card)] bg-white p-3 shadow-card">
                  <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl sm:w-40">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 py-1 pr-2">
                    <ArticleMeta article={article} category={categoryName(article.categorySlug)} />
                    <h3 className="mt-1.5 line-clamp-2 text-[16px] leading-snug font-semibold text-brand-800">
                      <AppLink href={`/kien-thuc/bai-viet/${article.slug}`} className="after:absolute after:inset-0">
                        {article.title}
                      </AppLink>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ArticleMeta({ article, category }: { article: Article; category: string }) {
  return (
    <p className="flex items-center gap-3 text-[13px] text-muted">
      <span className="font-semibold text-brand-500">{category}</span>
      <span className="flex items-center gap-1">
        <Eye className="size-3.5" />
        {formatCount(article.views)}
      </span>
    </p>
  );
}
