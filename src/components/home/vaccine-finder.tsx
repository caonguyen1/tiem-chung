"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { DiseaseGroup, Vaccine } from "@/content/types";
import { normalizeForSearch } from "@/lib/search";

import { BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";
import { SectionHeading } from "../ui/section-heading";
import { VaccineCard } from "../vaccine/vaccine-card";

type Props = {
  groups: DiseaseGroup[];
  vaccines: Vaccine[];
};

const MAX_RESULTS = 8;

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
    <section id="tra-cuu-vac-xin" className="scroll-mt-20 bg-canvas py-12 lg:scroll-mt-24 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tra cứu vắc xin"
          title="Bạn cần tiêm phòng bệnh gì?"
          description="Gõ tên vắc xin hoặc tên bệnh, hoặc chọn nhóm bệnh bên dưới để xem thông tin và giá."
        />

        <div className="mt-6 md:mt-8">
          <label className="relative block md:max-w-xl">
            <span className="sr-only">Tìm vắc xin</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-brand-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="VD: cúm, HPV, phế cầu, Gardasil…"
              className="h-13 w-full rounded-full border border-line bg-white pr-12 pl-12 text-[16px] shadow-card outline-none placeholder:text-muted/70 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Xóa tìm kiếm"
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-brand-50"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        <div
          role="tablist"
          aria-label="Nhóm bệnh"
          className={`no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0 ${term ? "opacity-50" : ""}`}
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
                className={`flex shrink-0 items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-[14px] font-semibold transition md:text-[15px] ${
                  selected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line bg-white text-brand-800 hover:border-brand-300"
                }`}
              >
                <span className={`grid size-8 place-items-center rounded-full ${selected ? "bg-white" : "bg-brand-50"}`}>
                  <BrandIconByName name={group.icon} bare className="size-7" />
                </span>
                {group.shortName}
              </button>
            );
          })}
        </div>

        <div id="vaccine-results" role="tabpanel" aria-live="polite" className="mt-5 md:mt-6">
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
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
              {results.map((vaccine) => (
                <li key={vaccine.slug} className="w-[82%] shrink-0 snap-start sm:w-[48%] md:w-auto">
                  <VaccineCard vaccine={vaccine} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center text-muted">
              Chưa tìm thấy vắc xin phù hợp. Hãy thử từ khóa khác hoặc gửi yêu cầu tư vấn.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center md:mt-8">
          <ButtonLink href="/vac-xin" variant="outline">
            Xem tất cả vắc xin
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
