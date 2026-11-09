import { BadgeCheck, Eye } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import type { Article, ArticleDetail } from "@/content/types";
import { formatCount } from "@/lib/format";

import { AppLink } from "../ui/app-link";
import { RichText } from "../ui/rich-text";
import { SectionTitle } from "../ui/section-title";
import { ArticleCard } from "./article-card";
import { Breadcrumb, type Crumb } from "./page-header";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

type Props = {
  article: ArticleDetail;
  crumbs: Crumb[];
  related: Article[];
  relatedTitle: string;
  relatedHref: (article: Article) => string;
  relatedCategory?: (article: Article) => string | undefined;
  /** Buttons under the text, e.g. "Đặt lịch". */
  actions?: ReactNode;
};

/** Article page body shared by knowledge articles and promotions. */
export function ArticleView({ article, crumbs, related, relatedTitle, relatedHref, relatedCategory, actions }: Props) {
  return (
    <main className="flex-1">
      <div className="container-site pt-4 desk:pt-6">
        <Breadcrumb items={crumbs} />
      </div>
      <article className="py-4 tab:py-5 desk:py-6">
        <div className="container-site">
          <div className="mx-auto max-w-[820px] overflow-hidden rounded-box bg-white">
            {article.image && <Image src={article.image} alt="" width={1200} height={750} sizes="(min-width: 901px) 820px, 100vw" priority className="aspect-[16/9] w-full object-cover" />}
            <div className="p-4 tab:p-7 desk:p-10">
              {article.categoryName && <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-bold text-brand-600">{article.categoryName}</span>}
              <h1 className="mt-2 text-2xl leading-tight font-bold text-brand-800 tab:text-[30px] desk:text-[36px]">{article.title}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-subtle tab:text-sm">
                <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time>
                {article.views > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Eye aria-hidden="true" className="size-4" />
                    {formatCount(article.views)} lượt xem
                  </span>
                )}
                {article.reviewer && (
                  <span className="inline-flex items-center gap-1">
                    <BadgeCheck aria-hidden="true" className="size-4 text-brand-600" />
                    Bác sĩ kiểm duyệt:{" "}
                    <AppLink href={`/doi-ngu-chuyen-mon/${article.reviewer.slug}`} className="font-bold text-link">
                      {article.reviewer.label}
                    </AppLink>
                  </span>
                )}
              </p>
              <p className="mt-4 text-base font-bold text-brand-800 desk:text-lg">{article.excerpt}</p>
              <div className="mt-4">
                <RichText text={article.body} headingLevel={2} />
              </div>
              {actions && <div className="mt-6 flex flex-wrap gap-2.5">{actions}</div>}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-4 tab:py-6 desk:py-8">
          <div className="container-site">
            <SectionTitle title={relatedTitle} />
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
              {related.map((item) => (
                <li key={item.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
                  <ArticleCard article={item} href={relatedHref(item)} category={relatedCategory?.(item)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
