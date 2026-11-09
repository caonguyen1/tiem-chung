"use client";

import { ChevronDown, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import type { DiseaseGroup, Vaccine, VaccinePackage } from "@/content/types";
import type { AgeGroup } from "@/lib/data/catalog";
import { CONSULT_HASH } from "@/lib/routes";

import { AdvisorIcon, BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";
import { PackageCard } from "./package-card";
import { VaccineTile } from "./vaccine-tile";

const PAGE_SIZE = 8;
type Sort = "popular" | "price-asc" | "price-desc";
type Tab = "vaccines" | "packages";

type Props = {
  vaccines: Vaccine[];
  packages: VaccinePackage[];
  groups: DiseaseGroup[];
  ageGroups: AgeGroup[];
  /** Pre-select a disease group (used by the group page). */
  initialGroup?: string;
};

/**
 * Vaccine catalogue (spec page 2): tabs "Vắc xin lẻ" / "Gói vắc xin", disease icons, filters by
 * age, disease, origin and number of doses, sorting and "Xem thêm". Everything is filtered in
 * the browser from the full list, so the page stays prerendered.
 */
export function VaccineCatalog({ vaccines, packages, groups, ageGroups, initialGroup = "" }: Props) {
  const [tab, setTab] = useState<Tab>("vaccines");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState(initialGroup);
  const [origin, setOrigin] = useState("");
  const [doses, setDoses] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [shown, setShown] = useState(PAGE_SIZE);

  const origins = useMemo(() => [...new Set(vaccines.map((vaccine) => vaccine.origin))].sort((a, b) => a.localeCompare(b, "vi")), [vaccines]);
  const doseOptions = useMemo(
    () => [...new Set(vaccines.flatMap((vaccine) => (vaccine.doseCount ? [vaccine.doseCount] : [])))].sort((a, b) => a - b),
    [vaccines],
  );

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

  const filtersActive = Boolean(age || group || origin || doses);
  const reset = () => {
    setAge("");
    setGroup("");
    setOrigin("");
    setDoses("");
    setShown(PAGE_SIZE);
  };
  const change = (setter: (value: string) => void) => (value: string) => {
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
            <ul className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 tab:mx-0 tab:flex-wrap tab:overflow-visible tab:px-0 desk:mt-5 desk:gap-2.5">
              {groups.map((item) => (
                <li key={item.slug} className="shrink-0">
                  <AppLink
                    href={`/vac-xin/nhom-benh/${item.slug}`}
                    className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-3.5 pl-1 text-[13px] font-bold text-brand-800 hover:border-brand-bright tab:text-sm"
                  >
                    <BrandIconByName name={item.icon} className="size-8" />
                    {item.shortName}
                  </AppLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-box bg-white p-3 tab:grid-cols-3 tab:p-4 desk:mt-5 desk:grid-cols-5 desk:gap-3">
              <Filter label="Độ tuổi" value={age} onChange={change(setAge)} options={ageGroups.map((item) => ({ value: item.value, label: item.label }))} />
              <Filter label="Phòng bệnh" value={group} onChange={change(setGroup)} options={groups.map((item) => ({ value: item.slug, label: item.name }))} />
              <Filter label="Nơi sản xuất" value={origin} onChange={change(setOrigin)} options={origins.map((item) => ({ value: item, label: item }))} />
              <Filter label="Số liều" value={doses} onChange={change(setDoses)} options={doseOptions.map((item) => ({ value: String(item), label: `${item} liều` }))} />
              <label className="grid gap-1 text-xs font-bold text-subtle">
                Sắp xếp
                <SelectBox value={sort} onChange={(value) => setSort(value as Sort)}>
                  <option value="popular">Được quan tâm</option>
                  <option value="price-asc">Giá thấp</option>
                  <option value="price-desc">Giá cao</option>
                </SelectBox>
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-subtle" aria-live="polite">
              <span>
                <b className="text-brand-800">{result.length}</b> vắc xin
              </span>
              {filtersActive && (
                <button type="button" onClick={reset} className="font-bold text-link">
                  Xóa bộ lọc
                </button>
              )}
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
              <ul className="mt-3 grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
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

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-subtle">
      {label}
      <SelectBox value={value} onChange={onChange}>
        <option value="">Tất cả</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectBox>
    </label>
  );
}

function SelectBox({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-line bg-surface-soft pr-9 pl-3 text-[14px] font-bold text-brand-800 outline-none focus:border-brand-bright"
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle" />
    </span>
  );
}
