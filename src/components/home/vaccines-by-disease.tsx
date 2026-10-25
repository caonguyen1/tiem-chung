"use client";

import { useState } from "react";

import type { DiseaseGroup, Vaccine } from "@/content/types";
import { isNavigable } from "@/lib/routes";

import { BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";
import { SectionHeading } from "../ui/section-heading";
import { VaccineCard } from "../vaccine/vaccine-card";

type Props = {
  groups: DiseaseGroup[];
  vaccines: Vaccine[];
};

export function VaccinesByDisease({ groups, vaccines }: Props) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug);
  const active = groups.find((g) => g.slug === activeSlug) ?? groups[0];
  const groupHref = `/vac-xin/nhom/${active.slug}`;
  const list = vaccines.filter((v) => v.diseaseSlugs.includes(active.slug)).slice(0, 4);

  return (
    <section className="bg-canvas py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Vắc xin phòng bệnh"
          title="Vắc xin theo bệnh nổi bật"
          description="Chọn nhóm bệnh để xem các loại vắc xin đang có tại Tâm Trí."
          action={{ label: "Xem tất cả vắc xin", href: "/vac-xin" }}
        />

        <div role="tablist" aria-label="Nhóm bệnh" className="no-scrollbar -mx-4 mt-8 flex gap-2.5 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {groups.map((group) => {
            const selected = group.slug === active.slug;
            return (
              <button
                key={group.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="disease-panel"
                onClick={() => setActiveSlug(group.slug)}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-[15px] font-semibold transition ${
                  selected
                    ? "border-brand-600 bg-brand-600 text-white shadow-[0_8px_20px_-10px_rgb(40_60_150/0.8)]"
                    : "border-line bg-white text-brand-800 hover:border-brand-300"
                }`}
              >
                <span className={`grid size-9 place-items-center rounded-full ${selected ? "bg-white" : "bg-brand-50"}`}>
                  <BrandIconByName name={group.icon} bare className="size-8" />
                </span>
                {group.shortName}
              </button>
            );
          })}
        </div>

        <div id="disease-panel" role="tabpanel" aria-label={active.name} className="mt-8">
          {list.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((vaccine) => (
                <li key={vaccine.slug}>
                  <VaccineCard vaccine={vaccine} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-white p-8 text-center text-muted">Nhóm bệnh này đang cập nhật vắc xin.</p>
          )}
          {isNavigable(groupHref) && (
            <div className="mt-8 flex justify-center">
              <ButtonLink href={groupHref} variant="outline">
                Xem vắc xin {active.name}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
