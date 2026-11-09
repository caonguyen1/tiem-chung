import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandIconByName } from "@/components/icons/brand-icons";
import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button-link";
import { VaccineTile } from "@/components/vaccine/vaccine-tile";
import { getDiseaseGroups, getVaccines } from "@/lib/data/catalog";
import { CONSULT_HASH } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getDiseaseGroups()).map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vac-xin/nhom-benh/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const group = (await getDiseaseGroups()).find((item) => item.slug === slug);
  return group ? { title: `Vắc xin phòng ${group.name}`, description: `Các loại vắc xin phòng ${group.name} tại Trung tâm Tiêm chủng Tâm Trí.` } : {};
}

export default async function DiseaseGroupPage({ params }: PageProps<"/vac-xin/nhom-benh/[slug]">) {
  const { slug } = await params;
  const [groups, vaccines] = await Promise.all([getDiseaseGroups(), getVaccines()]);
  const group = groups.find((item) => item.slug === slug);
  if (!group) notFound();
  const list = vaccines.filter((vaccine) => vaccine.diseaseSlugs.includes(slug));

  return (
    <main className="flex-1">
      <PageHeader
        title={`Vắc xin phòng ${group.name}`}
        description={`${list.length} loại vắc xin. Bác sĩ sẽ tư vấn loại và lịch tiêm phù hợp sau khi khám sàng lọc.`}
        crumbs={[{ label: "Vắc xin phòng bệnh", href: "/vac-xin" }, { label: group.name }]}
      />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 tab:mx-0 tab:flex-wrap tab:overflow-visible tab:px-0">
            {groups.map((item) => (
              <li key={item.slug} className="shrink-0">
                <AppLink
                  href={`/vac-xin/nhom-benh/${item.slug}`}
                  aria-current={item.slug === slug ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-[13px] font-bold tab:text-sm ${item.slug === slug ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-brand-800 hover:border-brand-bright"}`}
                >
                  <BrandIconByName name={item.icon} className="size-8" />
                  {item.shortName}
                </AppLink>
              </li>
            ))}
          </ul>

          {list.length === 0 ? (
            <div className="mt-4 rounded-box bg-white px-4 py-12 text-center">
              <p className="font-bold text-brand-800">Chưa có vắc xin trong nhóm này</p>
              <ButtonLink href={CONSULT_HASH} variant="secondary" className="mt-3">
                Yêu cầu tư vấn
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
              {list.map((vaccine) => (
                <li key={vaccine.slug}>
                  <VaccineTile vaccine={vaccine} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
