import { BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { VaccineVial } from "@/components/icons/vaccine-vial";
import { CenterCard } from "@/components/site/center-card";
import { Breadcrumb } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { RichText } from "@/components/ui/rich-text";
import { SectionTitle } from "@/components/ui/section-title";
import { VaccineTile } from "@/components/vaccine/vaccine-tile";
import { vaccineDisclaimer } from "@/content/details";
import type { VaccineStatus } from "@/content/types";
import { getVaccineDetail, getVaccines } from "@/lib/data/catalog";
import { getCenters } from "@/lib/data/content";
import { formatVnd } from "@/lib/format";
import { CONSULT_HASH } from "@/lib/routes";
import { vaccineAction } from "@/lib/vaccine-action";

const statusLabel: Record<VaccineStatus, string> = { book: "Đặt hẹn", preorder: "Đặt trước", consult: "Cần tư vấn" };

export async function generateStaticParams() {
  return (await getVaccines()).map((vaccine) => ({ slug: vaccine.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vac-xin/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vaccine = await getVaccineDetail(slug);
  return vaccine ? { title: `Vắc xin ${vaccine.name}`, description: vaccine.prevents } : {};
}

export default async function VaccineDetailPage({ params }: PageProps<"/vac-xin/[slug]">) {
  const { slug } = await params;
  const [vaccine, allVaccines, centers] = await Promise.all([getVaccineDetail(slug), getVaccines(), getCenters()]);
  if (!vaccine) notFound();

  const action = vaccineAction[vaccine.status];
  const related = allVaccines.filter((item) => item.slug !== vaccine.slug && item.diseaseSlugs.some((group) => vaccine.diseaseSlugs.includes(group))).slice(0, 4);
  const toc = [
    ...vaccine.sections.map((section) => ({ id: section.key, title: section.title })),
    ...(vaccine.reviewer ? [{ id: "bac-si-kiem-duyet", title: "Bác sĩ kiểm duyệt" }] : []),
    ...(vaccine.faqs.length ? [{ id: "cau-hoi-thuong-gap", title: "Câu hỏi thường gặp" }] : []),
    ...(centers.length ? [{ id: "trung-tam", title: "Trung tâm gần bạn" }] : []),
  ];
  const facts: [string, string][] = [
    ["Phòng bệnh", vaccine.prevents],
    ["Đối tượng tiêm", vaccine.audience],
    ["Nước sản xuất", vaccine.origin],
    ["Nhà sản xuất", vaccine.manufacturer],
    ...(vaccine.unit ? ([["Đơn vị", vaccine.unit]] as [string, string][]) : []),
    ...(vaccine.doseCount ? ([["Số liều", `${vaccine.doseCount} liều cho một phác đồ đầy đủ`]] as [string, string][]) : []),
  ];

  return (
    <main className="flex-1">
      <div className="container-site pt-4 desk:pt-6">
        <Breadcrumb
          items={[
            { label: "Vắc xin phòng bệnh", href: "/vac-xin" },
            ...(vaccine.groups[0] ? [{ label: vaccine.groups[0].name, href: `/vac-xin/nhom-benh/${vaccine.groups[0].slug}` }] : []),
            { label: vaccine.name },
          ]}
        />
      </div>

      <section className="py-4 tab:py-5 desk:py-6">
        <div className="container-site grid gap-3 rounded-box bg-white p-3 tab:p-5 desk:grid-cols-[minmax(0,420px)_1fr] desk:gap-8 desk:p-7">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-linear-160 from-surface-soft to-surface-deep">
              <span className="absolute top-3 left-3 z-[1] rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-brand-800">{vaccine.origin}</span>
              {vaccine.gallery[0] ? (
                <Image src={vaccine.gallery[0]} alt={vaccine.name} fill sizes="(min-width: 901px) 420px, 100vw" className="object-contain" priority />
              ) : (
                <VaccineVial label={vaccine.name.split(" ")[0]} className="absolute top-[8%] left-1/2 h-[84%] w-auto -translate-x-1/2 -rotate-[8deg]" />
              )}
            </div>
            {vaccine.gallery.length > 1 && (
              <ul className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                {vaccine.gallery.map((image) => (
                  <li key={image} className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-soft">
                    <Image src={image} alt="" fill sizes="64px" className="object-contain" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-bold text-brand-600">{statusLabel[vaccine.status]}</span>
            <h1 className="mt-2 text-[26px] leading-tight font-bold text-brand-800 desk:text-[36px]">{vaccine.name}</h1>
            <dl className="mt-4 grid gap-y-2.5 text-[14px] tab:text-[15px]">
              {facts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[110px_1fr] gap-3 border-b border-line pb-2.5 last:border-0 tab:grid-cols-[140px_1fr]">
                  <dt className="text-subtle">{label}</dt>
                  <dd className="font-bold text-brand-800">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[28px] font-bold text-brand-600 desk:text-[34px]">{formatVnd(vaccine.price)}</span>
              {vaccine.originalPrice && vaccine.originalPrice > vaccine.price && <s className="text-subtle">{formatVnd(vaccine.originalPrice)}</s>}
              <span className="text-xs text-subtle">Giá tham khảo, xác nhận tại trung tâm</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 tab:flex">
              <ButtonLink href={CONSULT_HASH} variant="secondary" size="md">
                Yêu cầu tư vấn
              </ButtonLink>
              <ButtonLink href={action.href(vaccine.slug)} size="md">
                {action.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 tab:py-5 desk:py-6">
        <div className="container-site grid grid-cols-1 gap-4 desk:grid-cols-[260px_minmax(0,1fr)] desk:gap-8">
          <nav aria-label="Mục lục" className="min-w-0 desk:sticky desk:top-4 desk:self-start">
            <p className="mb-2 text-sm font-bold text-brand-800">Mục lục</p>
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 tab:mx-0 tab:flex-wrap tab:px-0 desk:grid desk:gap-0.5 desk:overflow-visible">
              {toc.map((item) => (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    className="block rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap text-brand-600 ring-1 ring-line ring-inset hover:bg-brand-50 desk:rounded-lg desk:bg-transparent desk:px-3 desk:py-2 desk:text-[14.5px] desk:ring-0"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid min-w-0 gap-3 desk:gap-4">
            {vaccine.sections.map((section) => (
              <article key={section.key} id={section.key} className="scroll-mt-4 rounded-box bg-white p-4 tab:p-6 desk:p-7">
                <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">{section.title}</h2>
                <RichText text={section.body} />
              </article>
            ))}

            {vaccine.reviewer && (
              <article id="bac-si-kiem-duyet" className="flex scroll-mt-4 items-center gap-3 rounded-box bg-white p-4 tab:p-6">
                <BadgeCheck aria-hidden="true" className="size-9 shrink-0 text-brand-600" />
                <div>
                  <h2 className="text-sm text-subtle">Bác sĩ kiểm duyệt</h2>
                  <AppLink href={`/doi-ngu-chuyen-mon/${vaccine.reviewer.slug}`} className="text-lg font-bold text-brand-800">
                    {vaccine.reviewer.label}
                  </AppLink>
                  <p className="text-[14px] text-body">{vaccine.reviewer.specialty}</p>
                </div>
              </article>
            )}

            {vaccine.faqs.length > 0 && (
              <article id="cau-hoi-thuong-gap" className="scroll-mt-4 rounded-box bg-white p-4 tab:p-6 desk:p-7">
                <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Câu hỏi thường gặp</h2>
                <FaqList items={vaccine.faqs} />
              </article>
            )}

            {centers.length > 0 && (
              <article id="trung-tam" className="scroll-mt-4 rounded-box bg-white p-4 tab:p-6 desk:p-7">
                <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Trung tâm gần bạn</h2>
                <div className="grid gap-3 tab:grid-cols-2">
                  {centers.map((center) => (
                    <CenterCard key={center.slug} center={center} />
                  ))}
                </div>
              </article>
            )}

            <p className="rounded-box bg-surface-deep px-4 py-3 text-[13px] leading-relaxed text-body tab:px-6 tab:text-sm">
              <b className="text-brand-800">Miễn trừ trách nhiệm. </b>
              {vaccineDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-4 tab:py-6 desk:py-8">
          <div className="container-site">
            <SectionTitle title="Vắc xin cùng nhóm bệnh" />
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
              {related.map((item) => (
                <li key={item.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
                  <VaccineTile vaccine={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
