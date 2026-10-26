"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { DiseaseGroup, Vaccine } from "@/content/types";
import { BOOKING_HASH, CONSULT_HASH } from "@/lib/routes";
import { normalizeForSearch } from "@/lib/search";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";
import { VaccineCard } from "../vaccine/vaccine-card";

type Props = {
  groups: DiseaseGroup[];
  vaccines: Vaccine[];
};

const MAX_RESULTS = 8;
// Columns the consult card spans so a short row still fills the grid (2 cols md, 4 cols lg).
const FILL_SPAN: Record<number, string> = {
  1: "md:col-span-1 lg:col-span-3",
  2: "md:col-span-2 lg:col-span-2",
  3: "md:col-span-1 lg:col-span-1",
};
const POPULAR_TERMS = ["Cúm", "HPV", "Sốt xuất huyết", "Phế cầu"];

/**
 * "Tra cứu vắc xin": one place to find a vaccine, either by typing its name or
 * a disease, or by picking a disease group. Replaces the separate
 * "Vắc xin theo bệnh nổi bật" and "Tìm vắc xin theo nhóm bệnh" blocks.
 */
export function VaccineFinder({ groups, vaccines }: Props) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug);
  const [query, setQuery] = useState("");

  const groupNames = useMemo(() => new Map(groups.map((g) => [g.slug, g.name])), [groups]);
  const searchIndex = useMemo(
    () =>
      vaccines.map((vaccine) => ({
        vaccine,
        text: normalizeForSearch(
          [vaccine.name, vaccine.prevents, vaccine.manufacturer, ...vaccine.diseaseSlugs.map((slug) => groupNames.get(slug) ?? "")].join(" "),
        ),
      })),
    [vaccines, groupNames],
  );

  const term = normalizeForSearch(query);
  const active = groups.find((g) => g.slug === activeSlug) ?? groups[0];
  const results = term
    ? searchIndex.filter((entry) => entry.text.includes(term)).map((entry) => entry.vaccine).slice(0, MAX_RESULTS)
    : vaccines.filter((v) => v.diseaseSlugs.includes(active.slug));

  return (
    <section id="tra-cuu-vac-xin" className="scroll-mt-20 bg-canvas py-8 lg:scroll-mt-24 lg:py-20">
      <div className="container-page">
        {/* One search panel: title + search on top, the disease groups as a row of icon tiles below. */}
        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line/70">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-sun-50 px-4 pt-4 pb-4 md:px-8 md:pt-8 md:pb-7">
            <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="none" className="pointer-events-none absolute right-0 bottom-0 hidden h-1/2 w-1/4 lg:block">
              <path d="M120 230C200 120 360 70 620 60" stroke="#FADC00" strokeWidth="12" fill="none" />
            </svg>

            <div className="relative grid gap-3 md:gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-10">
              <div>
                <p className="hidden items-center gap-2 text-sm font-semibold text-brand-500 md:flex">
                  <span className="brand-stripe inline-block h-2 w-6 rounded-full" />
                  Tra cứu vắc xin
                </p>
                <h2 className="text-[20px] leading-tight font-bold tracking-tight text-balance text-brand-800 md:mt-2 md:text-[34px]">Bạn cần tiêm phòng bệnh gì?</h2>
                <p className="mt-2 hidden text-[15px] text-muted md:block">Gõ tên bệnh, tên vắc xin hoặc chọn nhóm bệnh để xem thông tin và giá.</p>
              </div>

              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  document.getElementById("vaccine-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <div className="flex h-12 items-center gap-2 rounded-full bg-white pr-1 pl-4 shadow-card md:h-14 md:pr-1.5 md:pl-5 md:shadow-lift ring-1 ring-line focus-within:ring-2 focus-within:ring-brand-400">
                  <Search className="size-5 shrink-0 text-brand-500" />
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Tìm vắc xin</span>
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Tìm bệnh hoặc vắc xin…"
                      className="h-10 w-full bg-transparent text-[16px] outline-none md:h-12 placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
                    />
                  </label>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Xóa tìm kiếm"
                      className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-brand-50"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                  <button type="submit" className="h-10 shrink-0 rounded-full bg-brand-600 px-4 text-[14px] md:h-11 md:px-5 md:text-[15px] font-semibold text-white transition hover:bg-brand-700">
                    Tìm
                  </button>
                </div>
                <div className="no-scrollbar -mx-4 mt-2.5 flex items-center gap-1.5 overflow-x-auto px-4 text-[12px] md:mx-0 md:mt-3 md:flex-wrap md:gap-2 md:px-0 md:text-[13px]">
                  <span className="shrink-0 text-muted">Tìm nhiều:</span>
                  {POPULAR_TERMS.map((popular) => (
                    <button
                      key={popular}
                      type="button"
                      onClick={() => setQuery(popular)}
                      className="shrink-0 rounded-full bg-white px-2.5 py-0.5 font-medium md:px-3 md:py-1 text-brand-700 ring-1 ring-line transition hover:ring-brand-300"
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Nhóm bệnh"
            className="no-scrollbar flex gap-0.5 overflow-x-auto border-t border-line p-1.5 md:grid md:grid-cols-8 md:gap-1 md:overflow-visible md:p-3"
          >
            {groups.map((group) => {
              const selected = !term && group.slug === active.slug;
              return (
                <button
                  key={group.slug}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="vaccine-results"
                  onClick={() => {
                    setQuery("");
                    setActiveSlug(group.slug);
                  }}
                  className={`relative flex w-[21%] shrink-0 flex-col items-center gap-1 rounded-xl px-0.5 pt-1.5 pb-2.5 text-center md:w-auto md:gap-1.5 md:rounded-2xl md:px-1 md:pt-2.5 md:pb-3 transition ${
                    selected ? "bg-brand-50" : "hover:bg-canvas"
                  }`}
                >
                  <BrandIconByName name={group.icon} className={`size-10 transition md:size-12 ${selected ? "scale-105" : ""}`} />
                  <span className={`text-[11.5px] leading-tight font-semibold md:text-[12.5px] ${selected ? "text-brand-700" : "text-ink/80"}`}>{group.shortName}</span>
                  {selected && <span className="absolute inset-x-4 bottom-1 h-1 rounded-full bg-sun-400 md:inset-x-5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div id="vaccine-results" role="tabpanel" aria-live="polite" className="mt-4 scroll-mt-24 md:mt-8">
          <p className="mb-3 text-[14px] text-muted">
            {term ? (
              <>
                {results.length} kết quả cho “<strong className="text-ink">{query.trim()}</strong>”
              </>
            ) : (
              <>
                Vắc xin phòng <strong className="text-ink">{active.name}</strong>
              </>
            )}
          </p>

          {results.length > 0 ? (
            // Mobile: one swipeable row so the page stays short. Desktop: a grid.
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
              {results.map((vaccine) => (
                <li key={vaccine.slug} className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                  <VaccineCard vaccine={vaccine} />
                </li>
              ))}
              {results.length < 4 && (
                <li className={`w-[70%] shrink-0 snap-start sm:w-[45%] md:w-auto ${FILL_SPAN[results.length]}`}>
                  <ConsultCard topic={term ? query.trim() : active.name} />
                </li>
              )}
            </ul>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center text-muted">
              Chưa tìm thấy vắc xin phù hợp. Hãy thử từ khóa khác hoặc gửi yêu cầu tư vấn.
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-center md:mt-8">
          <ButtonLink href="/vac-xin" variant="outline">
            Xem tất cả vắc xin
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Fills empty grid space with a nudge to ask a doctor or book directly. */
function ConsultCard({ topic }: { topic: string }) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl bg-brand-700 p-4 text-white md:rounded-[var(--radius-card)] md:p-6">
      <div className="flex items-start gap-3">
        <AdvisorIcon className="size-12 shrink-0 md:size-14" />
        <div>
          <p className="text-[17px] leading-snug font-bold md:text-xl">Chưa chắc nên chọn loại nào?</p>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-100 md:text-[14px]">
            Bác sĩ Tâm Trí tư vấn vắc xin phòng {topic} phù hợp với độ tuổi và sức khỏe của bạn.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ButtonLink href={CONSULT_HASH} variant="white" className="h-10 px-3 text-[14px]">
          Tư vấn
        </ButtonLink>
        <ButtonLink href={BOOKING_HASH} variant="sun" className="h-10 px-3 text-[14px] shadow-none">
          Đặt lịch
        </ButtonLink>
      </div>
    </div>
  );
}
