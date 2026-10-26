"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";

import { vaccinePackages, vaccines } from "@/content/catalog";
import { ageRanges, type Gender, genders, recommendFor } from "@/content/recommendations";
import { siteSettings } from "@/content/site";
import { formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH } from "@/lib/routes";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

/** "Tôi nên tiêm gì?" (spec page 9): pick an age range and gender, see suggestions at once. */
export function RecommendBand() {
  const [age, setAge] = useState(ageRanges[0].value);
  const [gender, setGender] = useState<Gender>("nu");

  const { suggested, pkg } = useMemo(() => {
    const rule = recommendFor(age, gender);
    return {
      suggested: rule.vaccineSlugs.map((slug) => vaccines.find((v) => v.slug === slug)).filter((v) => v !== undefined),
      pkg: vaccinePackages.find((p) => p.slug === rule.packageSlug),
    };
  }, [age, gender]);

  return (
    <section id="goi-y-vac-xin" className="scroll-mt-20 pb-12 lg:scroll-mt-24 lg:pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-700 p-4 md:p-8 lg:p-10">
          <svg aria-hidden="true" viewBox="0 0 600 300" preserveAspectRatio="none" className="pointer-events-none absolute top-0 right-0 hidden h-full w-[45%] lg:block">
            <path d="M40 320C120 110 320 20 640 20" stroke="#FADC00" strokeWidth="14" fill="none" />
          </svg>

          <div className="relative grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <AdvisorIcon className="size-12 shrink-0 md:size-16" />
                <h2 className="text-[24px] leading-tight font-bold text-white md:text-[32px]">Bạn chưa biết nên tiêm gì?</h2>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-100">Chọn độ tuổi và giới tính để xem gợi ý vắc xin lẻ và gói phù hợp.</p>

              <fieldset className="mt-5">
                <legend className="text-[14px] font-semibold text-white">Độ tuổi</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ageRanges.map((range) => (
                    <ChoiceChip key={range.value} name="age" checked={age === range.value} onChange={() => setAge(range.value)}>
                      {range.label}
                    </ChoiceChip>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-4">
                <legend className="text-[14px] font-semibold text-white">Giới tính</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {genders.map((g) => (
                    <ChoiceChip key={g.value} name="gender" checked={gender === g.value} onChange={() => setGender(g.value)}>
                      {g.label}
                    </ChoiceChip>
                  ))}
                </div>
              </fieldset>
            </div>

            <div aria-live="polite" className="rounded-2xl bg-white p-4 md:p-6">
              <h3 className="text-[16px] font-bold text-brand-800">Gợi ý cho bạn</h3>
              <ul className="mt-3 divide-y divide-line">
                {suggested.map((vaccine) => (
                  <li key={vaccine.slug} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-ink">{vaccine.name}</p>
                      <p className="line-clamp-1 text-[13px] text-muted">{vaccine.prevents}</p>
                    </div>
                    <p className="shrink-0 text-[14px] font-bold text-brand-700">{formatVnd(vaccine.price)}</p>
                    <AppLink
                      href={bookingHref(vaccine.slug)}
                      className="shrink-0 rounded-full border border-brand-200 px-3 py-1.5 text-[13px] font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
                    >
                      Đặt lịch
                    </AppLink>
                  </li>
                ))}
              </ul>

              {pkg && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-sun-50 p-3 ring-1 ring-sun-200">
                  <BrandIconByName name={pkg.icon} className="size-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-sun-600">Gói gợi ý</p>
                    <p className="text-[15px] leading-snug font-bold text-brand-800">{pkg.name}</p>
                    <p className="text-[13px] text-muted">
                      {pkg.vaccineCount} loại vắc xin · {pkg.doses} mũi · <strong className="text-brand-700">{formatVnd(pkg.price)}</strong>
                    </p>
                  </div>
                  <ButtonLink href={bookingHref(pkg.slug)} size="sm" className="shrink-0">
                    Đặt lịch
                  </ButtonLink>
                </div>
              )}

              <p className="mt-3 flex gap-2 text-[12px] leading-relaxed text-muted">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Gợi ý mang tính tham khảo. Bác sĩ sẽ khám sàng lọc và chỉ định phù hợp trước khi tiêm.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ButtonLink href={CONSULT_HASH} variant="outline" className="h-10 px-3 text-[14px]">
                  Yêu cầu tư vấn
                </ButtonLink>
                <ButtonLink href={siteSettings.zaloUrl} className="h-10 px-3 text-[14px]">
                  Chat với bác sĩ
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceChip({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label
      className={`cursor-pointer rounded-xl border px-2 py-2.5 text-center text-[14px] font-medium transition ${
        checked ? "border-sun-400 bg-sun-400 text-brand-900" : "border-white/20 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}
