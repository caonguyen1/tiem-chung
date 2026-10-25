import { AppLink } from "@/components/ui/app-link";

import type { DiseaseGroup } from "@/content/types";

import { BrandIconByName } from "../icons/brand-icons";
import { SectionHeading } from "../ui/section-heading";

/** "Danh mục nổi bật": the disease groups as large icon tiles. */
export function FeaturedCategories({ groups }: { groups: DiseaseGroup[] }) {
  return (
    <section className="py-12 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Danh mục nổi bật"
          title="Tìm vắc xin theo nhóm bệnh"
          action={{ label: "Tất cả 27 nhóm", href: "/vac-xin" }}
        />
        <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {groups.map((group) => (
            <li key={group.slug}>
              <AppLink
                href={`/vac-xin/nhom/${group.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-[var(--radius-card)] border border-line bg-white px-2 py-5 text-center transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <BrandIconByName name={group.icon} className="size-16 transition duration-300 group-hover:scale-110 lg:size-[72px]" />
                <span className="text-[14px] leading-snug font-semibold text-brand-800 lg:text-[15px]">{group.name}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
