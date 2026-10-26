import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { Article, ArticleCategory } from "@/content/types";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";
import { SectionHeading } from "../ui/section-heading";

type Props = { articles: Article[]; categories: ArticleCategory[] };

const SHOWN = 4;

/** The four most useful vaccination articles on one row; the library page holds the rest. */
export function KnowledgeSection({ articles, categories }: Props) {
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

  return (
    <section className="bg-canvas py-12 lg:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Kiến thức tiêm chủng" title="Hiểu đúng để tiêm đủ" description="Bài viết do bác sĩ Tâm Trí biên soạn và kiểm duyệt." />

        {/* Mobile: a swipeable row. Desktop: four columns. */}
        <ul className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-8 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
          {articles.slice(0, SHOWN).map((article) => (
            <li key={article.slug} className="w-[75%] shrink-0 snap-start sm:w-[45%] md:w-auto">
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card">
                <div className="relative aspect-[16/10]">
                  <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 300px, 75vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[12px] font-semibold text-brand-500">{categoryName(article.categorySlug)}</p>
                  <h3 className="mt-1 line-clamp-3 text-[16px] leading-snug font-bold text-brand-800">{article.title}</h3>
                  <AppLink
                    href={`/kien-thuc/bai-viet/${article.slug}`}
                    className="mt-auto inline-flex items-center gap-1 pt-3 text-[14px] font-semibold text-brand-600"
                  >
                    Đọc tiếp
                    <ArrowRight className="size-3.5" />
                  </AppLink>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center md:mt-8">
          <ButtonLink href="/kien-thuc" variant="outline">
            Xem tất cả kiến thức
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
