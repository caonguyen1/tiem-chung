"use client";

import { ChevronDown, ListFilter, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import type { DiseaseGroup, Vaccine, VaccinePackage } from "@/content/types";
import type { AgeGroup } from "@/lib/data/catalog";
import { CONSULT_HASH } from "@/lib/routes";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";
import { PackageCard } from "./package-card";
import { VaccineTile } from "./vaccine-tile";

const PAGE_SIZE = 9;
// Two rows are always shown: 2 columns on phones, 3 on tablets, 6 on desktop.
const GROUPS_ROWS = 2;
const FILTER_VISIBLE = 6;
type Sort = "popular" | "price-asc" | "price-desc";
type Tab = "vaccines" | "packages";
type Option = { value: string; label: string };

type Props = {
  vaccines: Vaccine[];
  packages: VaccinePackage[];
  groups: DiseaseGroup[];
  ageGroups: AgeGroup[];
};

/**
 * Vaccine catalogue (spec page 2): tabs "Vắc xin lẻ" / "Gói vắc xin", a grid of disease groups
 * (one row, "Xem tất cả danh mục" opens the rest), the list with sorting and "Xem thêm", and a
 * sticky filter column on the left (age, disease, origin, doses). Everything is filtered in
 * the browser from the full list, so the page stays prerendered.
 */
export function VaccineCatalog({ vaccines, packages, groups, ageGroups }: Props) {
  const [tab, setTab] = useState<Tab>("vaccines");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");
  const [origin, setOrigin] = useState("");
  const [doses, setDoses] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [allGroups, setAllGroups] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const origins = useMemo(() => [...new Set(vaccines.map((vaccine) => vaccine.origin))].sort((a, b) => a.localeCompare(b, "vi")), [vaccines]);
  const doseOptions = useMemo(() => [...new Set(vaccines.flatMap((vaccine) => (vaccine.doseCount ? [vaccine.doseCount] : [])))].sort((a, b) => a - b), [vaccines]);

  const result = useMemo(() => {
    const filtered = vaccines.filter(
      (vaccine) =>
        (!age || vaccine.ageSlugs?.includes(age)) &&
        (!group || vaccine.diseaseSlugs.includes(group)) &&
        (!origin || vaccine.origin === origin) &&
        (!doses || vaccine.doseCount === Number(doses)),
    );
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [vaccines, age, group, origin, doses, sort]);

  const activeCount = [age, group, origin, doses].filter(Boolean).length;
  const reset = () => {
    setAge("");
    setGroup("");
    setOrigin("");
    setDoses("");
    setShown(PAGE_SIZE);
  };
  const pick = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setShown(PAGE_SIZE);
  };

  return (
    <section className="py-4 tab:py-6 desk:py-8">
      <div className="container-site">
        <div role="tablist" aria-label="Loại sản phẩm" className="inline-flex rounded-full bg-white p-1 ring-1 ring-line ring-inset">
          <TabButton active={tab === "vaccines"} onClick={() => setTab("vaccines")}>
            Vắc xin lẻ
          </TabButton>
          <TabButton active={tab === "packages"} onClick={() => setTab("packages")}>
            Gói vắc xin
          </TabButton>
        </div>

        {tab === "vaccines" ? (
          <>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 tab:grid-cols-3 desk:mt-5 desk:grid-cols-6 desk:gap-3">
              {groups.map((item, index) => (
                <li key={item.slug} className={allGroups ? undefined : hiddenWhenCollapsed(index)}>
                  <AppLink
                    href={`/vac-xin/nhom-benh/${item.slug}`}
                    className="flex h-full items-center gap-2.5 rounded-xl border border-line bg-white p-2 hover:border-brand-bright desk:p-2.5"
                  >
                    <BrandIconByName name={item.icon} className="size-11 shrink-0 desk:size-12" />
                    <span className="min-w-0 text-[13px] leading-tight font-bold text-brand-800 desk:text-sm">{item.name}</span>
                  </AppLink>
                </li>
              ))}
            </ul>
            {groups.length > 2 * GROUPS_ROWS && (
              <div className={`mt-3 text-center ${allGroups ? "" : moreButtonVisibility(groups.length)}`}>
                <button type="button" onClick={() => setAllGroups((value) => !value)} aria-expanded={allGroups} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-link">
                  {allGroups ? "Thu gọn danh mục" : "Xem tất cả danh mục"}
                  <ChevronDown aria-hidden="true" className={`size-4 transition ${allGroups ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 desk:grid-cols-[300px_minmax(0,1fr)] desk:items-start desk:gap-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
                  <h2 className="text-xl font-bold text-brand-800 desk:text-2xl">
                    Danh sách vắc xin <span className="text-base font-normal text-subtle">({result.length})</span>
                  </h2>
                  <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 tab:mx-0 tab:px-0" role="group" aria-label="Sắp xếp theo">
                    <span className="shrink-0 text-sm text-subtle">Sắp xếp theo:</span>
                    {(
                      [
                        ["popular", "Được quan tâm"],
                        ["price-asc", "Giá thấp"],
                        ["price-desc", "Giá cao"],
                      ] as [Sort, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={sort === value}
                        onClick={() => setSort(value)}
                        className={`h-9 shrink-0 rounded-full px-4 text-[13.5px] font-bold ${sort === value ? "bg-brand-600 text-white" : "bg-white text-brand-600 ring-1 ring-brand-200 ring-inset hover:bg-brand-50"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  className="mt-3 flex h-11 w-full items-center justify-between rounded-xl bg-white px-4 text-[15px] font-bold text-brand-800 desk:hidden"
                >
                  <span className="inline-flex items-center gap-2">
                    <ListFilter aria-hidden="true" className="size-5" />
                    Bộ lọc vắc xin{activeCount > 0 && ` (${activeCount})`}
                  </span>
                  <ChevronDown aria-hidden="true" className={`size-5 transition ${filtersOpen ? "rotate-180" : ""}`} />
                </button>

                {/* On phones the filter panel sits here, opened by the button above. */}
                <div className={`mt-2 desk:hidden ${filtersOpen ? "" : "hidden"}`}>
                  <FilterPanel
                    ageGroups={ageGroups.map((item) => ({ value: item.value, label: item.label }))}
                    groups={groups.map((item) => ({ value: item.slug, label: item.name }))}
                    origins={origins.map((item) => ({ value: item, label: item }))}
                    doseOptions={doseOptions.map((item) => ({ value: String(item), label: `${item} liều` }))}
                    values={{ age, group, origin, doses }}
                    onPick={{ age: pick(setAge), group: pick(setGroup), origin: pick(setOrigin), doses: pick(setDoses) }}
                    activeCount={activeCount}
                    onReset={reset}
                    idPrefix="m"
                  />
                </div>

                {result.length === 0 ? (
                  <div className="mt-3 grid place-items-center gap-2 rounded-box bg-white px-4 py-12 text-center">
                    <SearchX aria-hidden="true" className="size-10 text-brand-bright" />
                    <p className="font-bold text-brand-800">Chưa có vắc xin phù hợp với bộ lọc</p>
                    <p className="text-sm text-subtle">Thử bỏ bớt điều kiện lọc hoặc để bác sĩ tư vấn giúp bạn.</p>
                    <ButtonLink href={CONSULT_HASH} variant="secondary" className="mt-2">
                      Yêu cầu tư vấn
                    </ButtonLink>
                  </div>
                ) : (
                  <ul className="mt-3 grid gap-3 tab:grid-cols-2 desk:grid-cols-3 desk:gap-4">
                    {result.slice(0, shown).map((vaccine) => (
                      <li key={vaccine.slug}>
                        <VaccineTile vaccine={vaccine} />
                      </li>
                    ))}
                  </ul>
                )}

                {result.length > shown && (
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setShown((count) => count + PAGE_SIZE)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-bold text-brand-600 ring-[1.5px] ring-brand-600 ring-inset hover:bg-brand-50"
                    >
                      Xem thêm {Math.min(PAGE_SIZE, result.length - shown)} vắc xin
                    </button>
                  </div>
                )}
              </div>

              <aside aria-label="Bộ lọc vắc xin" className="hidden desk:sticky desk:top-4 desk:order-first desk:block">
                <FilterPanel
                  ageGroups={ageGroups.map((item) => ({ value: item.value, label: item.label }))}
                  groups={groups.map((item) => ({ value: item.slug, label: item.name }))}
                  origins={origins.map((item) => ({ value: item, label: item }))}
                  doseOptions={doseOptions.map((item) => ({ value: String(item), label: `${item} liều` }))}
                  values={{ age, group, origin, doses }}
                  onPick={{ age: pick(setAge), group: pick(setGroup), origin: pick(setOrigin), doses: pick(setDoses) }}
                  activeCount={activeCount}
                  onReset={reset}
                  idPrefix="d"
                />
              </aside>
            </div>
          </>
        ) : (
          <ul className="mt-4 grid gap-3 tab:grid-cols-2 desk:mt-5 desk:grid-cols-4 desk:gap-4">
            {packages.map((pkg) => (
              <li key={pkg.slug}>
                <PackageCard pkg={pkg} />
              </li>
            ))}
          </ul>
        )}

        <div className="dots-overlay relative mt-6 flex flex-wrap items-center gap-3 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright p-4 text-white tab:p-5 desk:mt-8 desk:gap-5 desk:px-7 desk:py-5">
          <AdvisorIcon disc="white" className="relative z-[1] size-12 shrink-0 desk:size-14" />
          <div className="relative z-[1] min-w-0 flex-1 basis-56">
            <h2 className="text-lg leading-tight font-bold tab:text-[22px]">Bạn chưa biết nên tiêm gì?</h2>
            <p className="text-[13px] opacity-90 tab:text-base">Chọn độ tuổi và giới tính, chúng tôi gợi ý vắc xin phù hợp.</p>
          </div>
          <ButtonLink href="/toi-nen-tiem-gi" variant="onNavy" className="relative z-[1] max-tab:w-full">
            Xem gợi ý
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Classes that hide a group tile beyond the second row at the breakpoints where it overflows. */
function hiddenWhenCollapsed(index: number) {
  if (index >= 6 * GROUPS_ROWS) return "hidden";
  if (index >= 3 * GROUPS_ROWS) return "hidden desk:list-item";
  if (index >= 2 * GROUPS_ROWS) return "max-tab:hidden";
  return undefined;
}

/** "Xem tất cả danh mục" shows only at the breakpoints where some tile is hidden. */
function moreButtonVisibility(count: number) {
  if (count > 6 * GROUPS_ROWS) return "";
  if (count > 3 * GROUPS_ROWS) return "desk:hidden";
  return "tab:hidden";
}

type FilterKey = "age" | "group" | "origin" | "doses";

function FilterPanel({
  ageGroups,
  groups,
  origins,
  doseOptions,
  values,
  onPick,
  activeCount,
  onReset,
  idPrefix,
}: {
  ageGroups: Option[];
  groups: Option[];
  origins: Option[];
  doseOptions: Option[];
  values: Record<FilterKey, string>;
  onPick: Record<FilterKey, (value: string) => void>;
  activeCount: number;
  onReset: () => void;
  idPrefix: string;
}) {
  const [expanded, setExpanded] = useState<Record<FilterKey, boolean>>({ age: false, group: false, origin: false, doses: false });
  const sections: { key: FilterKey; title: string; options: Option[] }[] = [
    { key: "age", title: "Độ tuổi", options: ageGroups },
    { key: "group", title: "Phòng bệnh", options: groups },
    { key: "origin", title: "Nơi sản xuất", options: origins },
    { key: "doses", title: "Số liều", options: doseOptions },
  ];
  return (
    <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-box bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
        <h3 className="inline-flex items-center gap-2 text-base font-bold text-brand-800 desk:text-lg">
          <ListFilter aria-hidden="true" className="size-5" />
          Bộ lọc vắc xin
        </h3>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="text-sm font-bold text-link">
            Xóa lọc
          </button>
        )}
      </div>
      {sections.map((section) => (
        <details key={section.key} open={section.key === "age"} className="group border-b border-line px-4 py-3 last:border-0">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-brand-800 [&::-webkit-details-marker]:hidden">
            {section.title}
            <ChevronDown aria-hidden="true" className="size-4 text-subtle transition group-open:rotate-180" />
          </summary>
          <div role="radiogroup" aria-label={section.title} className="mt-2 grid gap-0.5">
            {visibleOptions(section.options, values[section.key], expanded[section.key]).map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-[14px] text-body hover:bg-surface-soft">
                <input
                  type="radio"
                  name={`${idPrefix}-${section.key}`}
                  checked={values[section.key] === option.value}
                  onChange={() => onPick[section.key](option.value)}
                  className="size-4 shrink-0 accent-brand-600"
                />
                {option.label}
              </label>
            ))}
            {section.options.length + 1 > FILTER_VISIBLE && (
              <button
                type="button"
                onClick={() => setExpanded((current) => ({ ...current, [section.key]: !current[section.key] }))}
                className="mt-1 inline-flex items-center gap-1 px-1 py-1.5 text-left text-[14px] font-bold text-link"
              >
                {expanded[section.key] ? "Thu gọn" : "Xem thêm"}
                <ChevronDown aria-hidden="true" className={`size-4 transition ${expanded[section.key] ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

/** "Tất cả" plus the first options; an option picked from further down stays visible. */
function visibleOptions(options: Option[], selected: string, expanded: boolean): Option[] {
  const all = [{ value: "", label: "Tất cả" }, ...options];
  if (expanded) return all;
  const head = all.slice(0, FILTER_VISIBLE);
  const picked = all.find((option) => option.value === selected);
  return picked && !head.includes(picked) ? [...head.slice(0, FILTER_VISIBLE - 1), picked] : head;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-10 rounded-full px-5 text-sm font-bold transition tab:px-6 tab:text-[15px] ${active ? "bg-brand-600 text-white" : "text-brand-600 hover:bg-brand-50"}`}
    >
      {children}
    </button>
  );
}
