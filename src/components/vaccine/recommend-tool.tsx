"use client";

import { ChevronDown, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Article, Center, Vaccine, VaccinePackage } from "@/content/types";
import type { AgeGroup, Gender, RecommendationRules } from "@/lib/data/catalog";
import { discountPercent, formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH } from "@/lib/routes";
import { vaccineAction } from "@/lib/vaccine-action";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { ArticleCard } from "../site/article-card";
import { CenterCard } from "../site/center-card";
import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

type Props = {
  ageGroups: AgeGroup[];
  rules: RecommendationRules;
  vaccines: Vaccine[];
  packages: VaccinePackage[];
  centers: Center[];
  articles: Article[];
  /** Zalo link for "Chat với bác sĩ"; the button is hidden while the account is not set up. */
  chatUrl: string;
};

const genders: { value: Gender; label: string }[] = [
  { value: "nu", label: "Nữ" },
  { value: "nam", label: "Nam" },
];
const POPULAR = 3;

/**
 * "Tôi nên tiêm gì?" (spec page 9). The page opens with the form and the most popular vaccines
 * and packages. Choosing an age range and gender and pressing "Nhận kết quả" swaps that block
 * for the vaccines and package the admin configured for the pair; then consult / chat, nearby
 * centers and related reading.
 */
export function RecommendTool({
  ageGroups,
  rules,
  vaccines,
  packages,
  centers,
  articles,
  chatUrl,
}: Props) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [asked, setAsked] = useState<{ age: string; gender: Gender } | null>(
    null,
  );
  const [missing, setMissing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (asked)
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [asked]);

  const rule = asked
    ? (rules[asked.age]?.[asked.gender] ?? rules[asked.age]?.all)
    : undefined;
  const resultVaccines = (rule?.vaccineSlugs ?? [])
    .map((slug) => vaccines.find((vaccine) => vaccine.slug === slug))
    .filter((vaccine) => vaccine !== undefined);
  const resultPackage = packages.find(
    (item) => item.slug === rule?.packageSlug,
  );

  const shownVaccines = asked ? resultVaccines : vaccines.slice(0, POPULAR);
  const shownPackages = asked
    ? resultPackage
      ? [resultPackage]
      : []
    : [...packages]
        .sort(
          (a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)),
        )
        .slice(0, POPULAR);
  const askedLabel = asked
    ? `${asked.gender === "nu" ? "Nữ" : "Nam"}, ${ageGroups.find((item) => item.value === asked.age)?.label ?? ""}`
    : "";

  return (
    <div className="grid gap-4 desk:gap-6">
      <form
        className="dots-overlay relative grid gap-3 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright p-3.5 text-white tab:p-5 desk:grid-cols-[1.3fr_auto_auto] desk:items-center desk:gap-5 desk:px-7 desk:py-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!age || !gender) {
            setMissing(true);
            return;
          }
          setMissing(false);
          setAsked({ age, gender });
        }}
      >
        <label className="relative z-[1] block">
          <span className="sr-only">Chọn khoảng tuổi tiêm</span>
          <select
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className={`h-12 w-full appearance-none rounded-xl border-2 bg-white pr-10 pl-4 text-[15px] outline-none focus:border-sun-400 ${missing && !age ? "border-sun-400" : "border-transparent"} ${age ? "font-bold text-brand-800" : "text-subtle"}`}
          >
            <option value="">Chọn khoảng tuổi tiêm</option>
            {ageGroups.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-subtle"
          />
        </label>

        <div
          role="radiogroup"
          aria-label="Giới tính"
          className="relative z-[1] flex items-center gap-2"
        >
          <span className="text-[15px] text-white/85">Giới tính</span>
          {genders.map((item) => (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={gender === item.value}
              onClick={() => setGender(item.value)}
              className={`h-12 flex-1 rounded-xl px-5 text-[15px] font-bold transition desk:flex-none ${gender === item.value ? "bg-white text-brand-800" : `bg-white/10 text-white ring-[1.5px] ring-inset ${missing && !gender ? "ring-sun-400" : "ring-white/60"} hover:bg-white/20`}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="relative z-[1] h-12 rounded-full bg-brand-600 px-7 text-[15px] font-bold text-sun-400 ring-[1.5px] ring-white/85 ring-inset hover:bg-brand-700"
        >
          Nhận kết quả
        </button>
        {missing && (
          <p
            role="alert"
            className="relative z-[1] text-sm font-bold text-sun-300 desk:col-span-3"
          >
            Vui lòng chọn khoảng tuổi và giới tính.
          </p>
        )}
      </form>

      <section
        ref={resultRef}
        aria-live="polite"
        className="scroll-mt-4 rounded-box bg-white p-3 ring-1 ring-line ring-inset tab:p-5 desk:p-6"
      >
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 desk:mb-4">
          <h2 className="text-xl font-bold text-brand-800 desk:text-2xl">
            {asked ? `Gợi ý cho bạn (${askedLabel})` : "Được quan tâm nhiều"}
          </h2>
          {asked && (
            <button
              type="button"
              onClick={() => setAsked(null)}
              className="text-sm font-bold text-link"
            >
              Xem vắc xin được quan tâm nhiều
            </button>
          )}
        </div>

        {asked && shownVaccines.length === 0 && shownPackages.length === 0 ? (
          <p className="rounded-xl bg-surface-soft px-4 py-8 text-center text-subtle">
            Chưa có gợi ý cho nhóm này. Hãy yêu cầu bác sĩ tư vấn.
          </p>
        ) : (
          <div className="grid gap-3 desk:grid-cols-2 desk:gap-5">
            <Column title="Vắc xin lẻ">
              {shownVaccines.map((vaccine) => {
                const action = vaccineAction[vaccine.status];
                return (
                  <Row
                    key={vaccine.slug}
                    href={`/vac-xin/${vaccine.slug}`}
                    tag={vaccine.origin}
                    title={vaccine.name}
                    sub={vaccine.prevents}
                    price={
                      <b className="text-brand-600">
                        {formatVnd(vaccine.price)}
                      </b>
                    }
                    action={{
                      label: action.label,
                      href: action.href(vaccine.slug),
                    }}
                  />
                );
              })}
            </Column>
            <Column title="Gói vắc xin">
              {shownPackages.map((pkg) => (
                <Row
                  key={pkg.slug}
                  href={`/goi-vac-xin/${pkg.slug}`}
                  icon={pkg.icon}
                  tag={pkg.audienceLabel}
                  title={pkg.name}
                  sub={`${pkg.vaccineCount} loại vắc xin, ${pkg.doses} mũi`}
                  price={
                    <span className="flex flex-wrap items-baseline justify-end gap-x-2">
                      <b className="text-brand-600">{formatVnd(pkg.price)}</b>
                      <s className="text-xs text-subtle">
                        {formatVnd(pkg.originalPrice)}
                      </s>
                      <span className="rounded-md bg-warn-soft px-1.5 py-px text-[11px] font-bold text-warn">
                        -{discountPercent(pkg.price, pkg.originalPrice)}%
                      </span>
                    </span>
                  }
                  action={{ label: "Đặt lịch", href: bookingHref(pkg.slug) }}
                />
              ))}
            </Column>
          </div>
        )}
      </section>

      <div className="grid gap-3 desk:grid-cols-2 desk:gap-5">
        {centers.length > 0 && (
          <section className="rounded-box bg-white p-3 ring-1 ring-line ring-inset tab:p-5 desk:p-6">
            <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">
              Trung tâm gần bạn
            </h2>
            <div className="grid gap-3">
              {centers.map((center) => (
                <CenterCard key={center.slug} center={center} />
              ))}
            </div>
          </section>
        )}
        <section className="dots-overlay relative flex flex-col justify-center gap-4 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright p-5 text-white tab:p-7 desk:p-8">
          <AdvisorIcon
            disc="white"
            className="relative z-[1] size-16 desk:size-20"
          />
          <div className="relative z-[1]">
            <h2 className="text-xl leading-tight font-bold tab:text-2xl desk:text-[28px]">
              Cần bác sĩ tư vấn riêng?
            </h2>
            <p className="mt-1.5 text-[14px] opacity-90 tab:text-base">
              Gửi yêu cầu, bác sĩ sẽ gọi lại giúp bạn chọn lịch tiêm phù hợp với
              độ tuổi và sức khỏe.
            </p>
          </div>
          <div className="relative z-[1] grid gap-2.5 tab:flex tab:flex-wrap">
            <ButtonLink href={CONSULT_HASH} variant="onNavy">
              Yêu cầu tư vấn
            </ButtonLink>
            {chatUrl && (
              <ButtonLink href={chatUrl} variant="white">
                Chat với bác sĩ
              </ButtonLink>
            )}
          </div>
        </section>
      </div>

      {articles.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">
            Bài viết cho bạn
          </h2>
          <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard
                  article={article}
                  href={`/kien-thuc/bai-viet/${article.slug}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="flex gap-2 rounded-box bg-surface-deep px-4 py-3 text-[13px] leading-relaxed text-body tab:px-6 tab:text-sm">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          <b className="text-brand-800">Miễn trừ trách nhiệm. </b>
          Gợi ý mang tính tham khảo. Bác sĩ sẽ khám sàng lọc và chỉ định loại
          vắc xin, số mũi phù hợp trước khi tiêm.
        </span>
      </p>
    </div>
  );
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const hasItems = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <div className="rounded-xl bg-surface-soft p-2.5 tab:p-3.5">
      <h3 className="mb-2 px-1 text-[13px] font-bold tracking-[0.04em] text-subtle uppercase">
        {title}
      </h3>
      {hasItems ? (
        <ul className="grid gap-2">{children}</ul>
      ) : (
        <p className="px-1 py-4 text-sm text-subtle">Chưa có gợi ý.</p>
      )}
    </div>
  );
}

function Row({
  href,
  icon,
  tag,
  title,
  sub,
  price,
  action,
}: {
  href: string;
  icon?: Parameters<typeof BrandIconByName>[0]["name"];
  tag: string;
  title: string;
  sub: string;
  price: React.ReactNode;
  action: { label: string; href: string };
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
      {icon && <BrandIconByName name={icon} className="size-11 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-link">{tag}</p>
        <AppLink
          href={href}
          className="block text-[15px] leading-tight font-bold text-brand-800 hover:underline"
        >
          {title}
        </AppLink>
        <p className="line-clamp-1 text-[13px] text-subtle">{sub}</p>
        <div className="mt-1 text-[14px]">{price}</div>
      </div>
      <ButtonLink href={action.href} size="sm" className="shrink-0">
        {action.label}
      </ButtonLink>
    </li>
  );
}
