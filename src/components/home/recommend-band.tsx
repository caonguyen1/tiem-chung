"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isNavigable } from "@/lib/routes";

import { AdvisorIcon } from "../icons/brand-icons";

const TOOL_PATH = "/toi-nen-tiem-gi";

const ageRanges = [
  { value: "0-6-thang", label: "0 – 6 tháng" },
  { value: "6-24-thang", label: "6 – 24 tháng" },
  { value: "2-9-tuoi", label: "2 – 9 tuổi" },
  { value: "9-18-tuoi", label: "9 – 18 tuổi" },
  { value: "18-45-tuoi", label: "18 – 45 tuổi" },
  { value: "tren-45-tuoi", label: "Trên 45 tuổi" },
];

const genders = [
  { value: "nu", label: "Nữ" },
  { value: "nam", label: "Nam" },
];

/** A shortcut into the "Tôi nên tiêm gì" tool (spec page 9). */
export function RecommendBand() {
  const router = useRouter();
  const [age, setAge] = useState(ageRanges[0].value);
  const [gender, setGender] = useState(genders[0].value);

  return (
    <section className="py-4 lg:py-8">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-700 px-6 py-10 md:px-12 lg:py-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 600 300"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 right-0 hidden h-full w-[52%] lg:block"
          >
            <path d="M40 320C120 110 320 20 640 20" stroke="#FADC00" strokeWidth="18" fill="none" />
            <path d="M120 340C200 160 360 80 640 80" stroke="#fff" strokeOpacity="0.08" strokeWidth="48" fill="none" />
          </svg>

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div className="flex gap-5">
              <AdvisorIcon className="hidden size-20 shrink-0 sm:block" />
              <div>
                <h2 className="text-[28px] leading-tight font-bold text-white md:text-4xl">Bạn chưa biết nên tiêm gì?</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-brand-100">
                  Chọn độ tuổi và giới tính, Tâm Trí gợi ý ngay vắc xin lẻ và gói phù hợp. Bác sĩ sẽ tư vấn thêm khi bạn đến khám sàng lọc.
                </p>
              </div>
            </div>

            <form
              className="grid gap-4 rounded-2xl bg-white p-5 shadow-lift md:p-6"
              onSubmit={(event) => {
                event.preventDefault();
                router.push(`${TOOL_PATH}?tuoi=${age}&gioi-tinh=${gender}`);
              }}
            >
              <fieldset>
                <legend className="text-sm font-semibold text-ink">Độ tuổi</legend>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ageRanges.map((range) => (
                    <label
                      key={range.value}
                      className="cursor-pointer rounded-xl border border-line px-3 py-2.5 text-center text-[14px] font-medium text-ink transition has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-700 hover:border-brand-300"
                    >
                      <input
                        type="radio"
                        name="age"
                        value={range.value}
                        checked={age === range.value}
                        onChange={() => setAge(range.value)}
                        className="sr-only"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <fieldset className="flex-1">
                  <legend className="text-sm font-semibold text-ink">Giới tính</legend>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {genders.map((g) => (
                      <label
                        key={g.value}
                        className="cursor-pointer rounded-xl border border-line px-3 py-2.5 text-center text-[14px] font-medium text-ink transition has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-700 hover:border-brand-300"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.value}
                          checked={gender === g.value}
                          onChange={() => setGender(g.value)}
                          className="sr-only"
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button
                  type="submit"
                  disabled={!isNavigable(TOOL_PATH)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sun-400 px-6 text-[15px] font-bold text-brand-900 transition enabled:hover:bg-sun-300 disabled:cursor-default"
                >
                  Xem gợi ý
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
