"use client";

import { Info } from "lucide-react";
import { useState } from "react";

import type { Article, Center, Vaccine, VaccinePackage } from "@/content/types";
import type { AgeGroup, Gender, RecommendationRules } from "@/lib/data/catalog";
import { CONSULT_HASH } from "@/lib/routes";

import { ArticleCard } from "../site/article-card";
import { CenterCard } from "../site/center-card";
import { ButtonLink } from "../ui/button-link";
import { PackageCard } from "./package-card";
import { VaccineTile } from "./vaccine-tile";

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

/**
 * "Tôi nên tiêm gì?" (spec page 9): pick an age range and gender, get the vaccines and the
 * package the admin configured for that pair, then consult / chat, nearby centers and
 * related reading. Results update as the choice changes.
 */
export function RecommendTool({ ageGroups, rules, vaccines, packages, centers, articles, chatUrl }: Props) {
  const [age, setAge] = useState(ageGroups[0]?.value ?? "");
  const [gender, setGender] = useState<Gender>("nu");

  const rule = rules[age]?.[gender] ?? rules[age]?.all;
  const picks = (rule?.vaccineSlugs ?? []).map((slug) => vaccines.find((vaccine) => vaccine.slug === slug)).filter((vaccine) => vaccine !== undefined);
  const pkg = packages.find((item) => item.slug === rule?.packageSlug);
  const ageLabel = ageGroups.find((item) => item.value === age)?.label ?? "";

  return (
    <div className="grid gap-4 desk:gap-6">
      <div className="rounded-box bg-white p-4 tab:p-6 desk:p-7">
        <fieldset>
          <legend className="text-base font-bold text-brand-800">Độ tuổi</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {ageGroups.map((item) => (
              <Chip key={item.value} active={item.value === age} onClick={() => setAge(item.value)}>
                {item.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4">
          <legend className="text-base font-bold text-brand-800">Giới tính</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {genders.map((item) => (
              <Chip key={item.value} active={item.value === gender} onClick={() => setGender(item.value)}>
                {item.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div aria-live="polite" className="grid gap-4 desk:gap-6">
        <div>
          <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">
            Vắc xin gợi ý cho {gender === "nu" ? "nữ" : "nam"}, {ageLabel}
          </h2>
          {picks.length === 0 ? (
            <p className="rounded-box bg-white px-4 py-8 text-center text-subtle">Chưa có gợi ý cho nhóm này. Hãy yêu cầu bác sĩ tư vấn.</p>
          ) : (
            <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
              {picks.map((vaccine) => (
                <li key={vaccine.slug}>
                  <VaccineTile vaccine={vaccine} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {pkg && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Gói vắc xin gợi ý</h2>
            <div className="max-w-sm">
              <PackageCard pkg={pkg} />
            </div>
          </div>
        )}
      </div>

      <div className="dots-overlay relative flex flex-wrap items-center gap-3 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright p-4 text-white tab:p-5 desk:gap-5 desk:px-7 desk:py-5">
        <div className="relative z-[1] min-w-0 flex-1 basis-60">
          <h2 className="text-lg leading-tight font-bold tab:text-[22px]">Cần bác sĩ tư vấn riêng?</h2>
          <p className="text-[13px] opacity-90 tab:text-base">Gửi yêu cầu, bác sĩ sẽ gọi lại giúp bạn chọn lịch tiêm phù hợp.</p>
        </div>
        <div className="relative z-[1] flex flex-wrap gap-2.5 max-tab:w-full max-tab:[&>*]:flex-1">
          <ButtonLink href={CONSULT_HASH} variant="onNavy">
            Yêu cầu tư vấn
          </ButtonLink>
          {chatUrl && (
            <ButtonLink href={chatUrl} variant="white">
              Chat với bác sĩ
            </ButtonLink>
          )}
        </div>
      </div>

      {centers.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Trung tâm gần bạn</h2>
          <div className="grid gap-3 tab:grid-cols-2 desk:grid-cols-3">
            {centers.map((center) => (
              <CenterCard key={center.slug} center={center} />
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Bài viết cho bạn</h2>
          <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} href={`/kien-thuc/bai-viet/${article.slug}`} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="flex gap-2 rounded-box bg-surface-deep px-4 py-3 text-[13px] leading-relaxed text-body tab:px-6 tab:text-sm">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          <b className="text-brand-800">Miễn trừ trách nhiệm. </b>
          Gợi ý mang tính tham khảo. Bác sĩ sẽ khám sàng lọc và chỉ định loại vắc xin, số mũi phù hợp trước khi tiêm.
        </span>
      </p>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-11 rounded-full px-5 text-[15px] font-bold transition ${active ? "bg-brand-600 text-white" : "bg-white text-brand-600 ring-[1.5px] ring-brand-600 ring-inset hover:bg-brand-50"}`}
    >
      {children}
    </button>
  );
}
