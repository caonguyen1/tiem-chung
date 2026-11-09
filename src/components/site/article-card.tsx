import { Eye } from "lucide-react";
import Image from "next/image";

import type { Article } from "@/content/types";
import { formatCount } from "@/lib/format";

import { AppLink } from "../ui/app-link";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Layout C article card: 16:10 picture, category tag, date, title (and views when asked). */
export function ArticleCard({ article, href, category, showViews = false }: { article: Article; href: string; category?: string; showViews?: boolean }) {
  return (
    <AppLink href={href} className="block h-full overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative">
        <Image src={article.image} alt="" width={640} height={400} sizes="(min-width: 901px) 290px, (min-width: 601px) 45vw, 74vw" className="aspect-[16/10] w-full object-cover" />
        {category && (
          <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-brand-600 desk:bottom-3 desk:left-3 desk:px-3 desk:py-1 desk:text-xs">{category}</span>
        )}
      </div>
      <div className="px-3.5 pt-3 pb-3.5 desk:px-[18px] desk:pt-4 desk:pb-5">
        <p className="flex items-center gap-3 text-xs text-subtle desk:text-[13px]">
          {dateFormat.format(new Date(article.publishedAt))}
          {showViews && (
            <span className="inline-flex items-center gap-1">
              <Eye aria-hidden="true" className="size-3.5" />
              {formatCount(article.views)} lượt xem
            </span>
          )}
        </p>
        <h3 className="mt-1 text-[15px] leading-snug font-bold text-brand-800 desk:mt-1.5 desk:text-[17px]">{article.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-body desk:text-sm">{article.excerpt}</p>
      </div>
    </AppLink>
  );
}
