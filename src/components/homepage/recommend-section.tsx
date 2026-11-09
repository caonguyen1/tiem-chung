"use client";

import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

import { vaccinePackages, vaccines } from "@/content/catalog";
import { ageRanges, genders, recommendFor, type Gender } from "@/content/recommendations";
import { formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH } from "@/lib/routes";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";

/**
 * "Bạn chưa biết tiêm gì?" (client feedback 2026-11-03: keep the navy gradient, keep it
 * short). Choosing an age and gender and pressing "Xem gợi ý" opens the suggestions in a
 * white panel below, so no extra dark block sits under the band.
 */
export function RecommendSection() {
  const [age, setAge] = useState(ageRanges[0].value);
  const [gender, setGender] = useState<Gender>("nu");
  const [shown, setShown] = useState(false);

  const rule = recommendFor(age, gender);
  const picks = rule.vaccineSlugs.map((slug) => vaccines.find((vaccine) => vaccine.slug === slug)).filter((vaccine) => vaccine !== undefined);
  const pkg = vaccinePackages.find((item) => item.slug === rule.packageSlug);

  return (
    <section id="goi-y-vac-xin" className="scroll-mt-3 py-4 tab:py-6 desk:py-8">
      <div className="container-site">
        <form
          className="dots-overlay grid grid-cols-[auto_1fr] items-center gap-3 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright p-4 text-white tab:p-5 desk:grid-cols-[auto_1fr_auto] desk:gap-[22px] desk:px-7 desk:py-[18px]"
          onSubmit={(event) => {
            event.preventDefault();
            setShown(true);
          }}
        >
          <AdvisorIcon disc="white" className="size-11 tab:size-[52px] desk:size-14" />
          <div>
            <h2 className="text-[19px] leading-tight font-bold tab:text-[22px] desk:text-[23px]">Bạn chưa biết tiêm gì?</h2>
            <p className="text-[13px] opacity-90 tab:text-base">Chọn độ tuổi và giới tính, chúng tôi gợi ý vắc xin phù hợp.</p>
          </div>
          <div className="col-span-full flex flex-wrap gap-2 desk:col-span-1 desk:flex-nowrap desk:gap-2.5">
            <Select label="Độ tuổi" value={age} onChange={setAge} options={ageRanges} />
            <Select label="Giới tính" value={gender} onChange={(value) => setGender(value as Gender)} options={genders} />
            <button
              type="submit"
              className="h-11 flex-[1_0_100%] rounded-full bg-brand-600 px-[22px] text-[13.5px] font-bold text-sun-400 ring-[1.5px] ring-white/85 ring-inset tab:h-12 tab:flex-none tab:text-[15px] desk:h-[46px]"
            >
              Xem gợi ý
            </button>
          </div>
        </form>

        {shown && (
          <div className="mt-2.5 grid gap-3 rounded-box bg-white p-4 tab:p-5 desk:mt-3 desk:grid-cols-[1.4fr_1fr] desk:gap-6 desk:p-6" aria-live="polite">
            <div>
              <h3 className="font-bold text-brand-800">Vắc xin gợi ý</h3>
              <ul className="mt-1">
                {picks.map((vaccine) => (
                  <li key={vaccine.slug} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                    <div className="min-w-0 flex-1">
                      <b className="block text-brand-800">{vaccine.name}</b>
                      <span className="line-clamp-1 text-[13px] text-subtle">{vaccine.prevents}</span>
                    </div>
                    <span className="hidden shrink-0 font-bold text-brand-600 tab:block">{formatVnd(vaccine.price)}</span>
                    <ButtonLink href={bookingHref(vaccine.slug)} variant="secondary" size="sm" className="shrink-0">
                      Đặt lịch
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              {pkg && (
                <div className="flex items-center gap-3 rounded-xl bg-sun-50 p-3.5 ring-1 ring-sun-100 ring-inset">
                  <BrandIconByName name={pkg.icon} disc="white" className="size-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-sun-600">Gói gợi ý</span>
                    <b className="block leading-tight text-brand-800">{pkg.name}</b>
                    <span className="text-[13px] text-subtle">
                      {pkg.vaccineCount} loại vắc xin, {pkg.doses} mũi, {formatVnd(pkg.price)}
                    </span>
                  </div>
                  <ButtonLink href={bookingHref(pkg.slug)} size="sm" className="shrink-0">
                    Đặt lịch
                  </ButtonLink>
                </div>
              )}
              <p className="flex gap-2 text-[13px] text-subtle">
                <Info className="mt-0.5 size-4 shrink-0" />
                Gợi ý mang tính tham khảo. Bác sĩ sẽ khám sàng lọc và chỉ định phù hợp trước khi tiêm.
              </p>
              <ButtonLink href={CONSULT_HASH} variant="secondary" className="w-full">
                Yêu cầu tư vấn
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex h-11 min-w-0 flex-1 flex-col justify-center rounded-lg bg-white pr-8 pl-2.5 text-brand-800 tab:h-12 tab:pl-4 desk:h-[46px] desk:min-w-[180px] desk:flex-none desk:pl-5">
      <span className="text-[11px] leading-none text-subtle tab:text-[11.5px]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none bg-transparent text-[13.5px] leading-tight font-bold outline-none tab:text-[15px]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 size-4 text-subtle" />
    </label>
  );
}
