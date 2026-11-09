"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { DiseaseGroup, Vaccine } from "@/content/types";
import { normalizeForSearch } from "@/lib/search";

import { BrandIconByName } from "../icons/brand-icons";
import { VACCINE_SEARCH_EVENT } from "../site/header";
import { SectionTitle } from "../ui/section-title";
import { VaccineTile } from "../vaccine/vaccine-tile";

const MAX_RESULTS = 8;

/**
 * "Vắc xin theo bệnh": pick a disease group to see its vaccines, or search from the
 * header (the search box sends its query here through VACCINE_SEARCH_EVENT).
 */
export function VaccineByDisease({ groups, vaccines }: { groups: DiseaseGroup[]; vaccines: Vaccine[] }) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onSearch = (event: Event) => setQuery(String((event as CustomEvent<string>).detail ?? ""));
    window.addEventListener(VACCINE_SEARCH_EVENT, onSearch);
    return () => window.removeEventListener(VACCINE_SEARCH_EVENT, onSearch);
  }, []);

  const groupNames = useMemo(() => new Map(groups.map((group) => [group.slug, group.name])), [groups]);
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
  const active = groups.find((group) => group.slug === activeSlug) ?? groups[0];
  const results = term
    ? searchIndex.filter((entry) => entry.text.includes(term)).map((entry) => entry.vaccine).slice(0, MAX_RESULTS)
    : vaccines.filter((vaccine) => vaccine.diseaseSlugs.includes(active.slug));

  return (
    <section id="tra-cuu-vac-xin" className="scroll-mt-3 bg-white py-6 tab:bg-linear-to-b tab:from-surface tab:to-white tab:to-30% desk:py-8">
      <div className="container-site">
        <SectionTitle title="Vắc xin theo bệnh" action={{ label: "Tất cả vắc xin", href: "/vac-xin" }} />
        <div className="tab:rounded-box tab:bg-white tab:p-5 desk:p-8">
          <div
            role="tablist"
            aria-label="Nhóm bệnh"
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-0.5 pb-1 tab:mx-0 tab:grid tab:grid-cols-4 tab:gap-2 tab:overflow-visible tab:p-0 desk:grid-cols-8 desk:gap-3"
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
                  className={`flex w-20 shrink-0 snap-start flex-col items-center gap-1 rounded-lg border px-1 py-2.5 text-center text-[11.5px] leading-tight font-bold text-brand-800 tab:w-auto tab:gap-1.5 tab:rounded-xl tab:border-2 tab:py-3 tab:text-[13px] desk:gap-2.5 desk:pt-[18px] desk:pb-4 desk:text-[14.5px] ${
                    selected
                      ? "border-brand-600 bg-brand-50 shadow-[0_10px_20px_-12px_rgb(40_60_150/0.6)]"
                      : "border-line bg-white tab:border-transparent tab:ring-1 tab:ring-line tab:ring-inset"
                  }`}
                >
                  <BrandIconByName name={group.icon} className="size-9 tab:size-12 desk:size-[60px]" />
                  {group.shortName}
                </button>
              );
            })}
          </div>

          <div id="vaccine-results" role="tabpanel" aria-live="polite">
            <div className="my-3 flex items-center justify-between gap-2 text-[13px] text-subtle tab:mt-7 tab:mb-4 tab:text-[15px]">
              {term ? (
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate">
                    {results.length} kết quả cho “<b className="text-brand-800">{query.trim()}</b>”
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-brand-600"
                  >
                    <X className="size-3.5" />
                    Bỏ tìm
                  </button>
                </span>
              ) : (
                <span>
                  Vắc xin phòng <b className="text-brand-800">{active.name}</b>
                </span>
              )}
              <span className="shrink-0">{results.length} vắc xin</span>
            </div>

            {results.length > 0 ? (
              <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-0.5 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:gap-2.5 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
                {results.map((vaccine, index) => (
                  <li key={vaccine.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
                    <VaccineTile vaccine={vaccine} cap={index % 2 ? "blue" : "sun"} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-surface p-6 text-center text-body">Chưa tìm thấy vắc xin phù hợp. Hãy thử từ khóa khác hoặc gửi yêu cầu tư vấn.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
