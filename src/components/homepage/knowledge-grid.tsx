import Image from "next/image";

import type { Article, ArticleCategory } from "@/content/types";

import { AppLink } from "../ui/app-link";
import { SectionTitle } from "../ui/section-title";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/** "Kiến thức": the four latest articles; a swipeable row on phones. */
export function KnowledgeGrid({ articles, categories }: { articles: Article[]; categories: ArticleCategory[] }) {
  const categoryName = new Map(categories.map((category) => [category.slug, category.name]));
  return (
    <section className="py-4 tab:py-6 desk:py-8">
      <div className="container-site">
        <SectionTitle title="Kiến thức" action={{ label: "Tất cả bài viết", href: "/kien-thuc" }} />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-0.5 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:gap-2.5 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
          {articles.slice(0, 4).map((article) => (
            <li key={article.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
              <AppLink href={`/kien-thuc/bai-viet/${article.slug}`} className="block h-full overflow-hidden rounded-xl border border-line bg-white">
                <div className="relative">
                  <Image src={article.image} alt="" width={640} height={400} sizes="(min-width: 901px) 290px, 74vw" className="aspect-[16/10] w-full object-cover" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-brand-600 desk:bottom-3 desk:left-3 desk:px-3 desk:py-1 desk:text-xs">
                    {categoryName.get(article.categorySlug)}
                  </span>
                </div>
                <div className="px-3.5 pt-3 pb-3.5 desk:px-[18px] desk:pt-4 desk:pb-5">
                  <p className="text-xs text-subtle desk:text-[13px]">{dateFormat.format(new Date(article.publishedAt))}</p>
                  <h3 className="mt-1 text-[15px] leading-snug font-bold text-brand-800 desk:mt-1.5 desk:text-[17px]">{article.title}</h3>
                </div>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
