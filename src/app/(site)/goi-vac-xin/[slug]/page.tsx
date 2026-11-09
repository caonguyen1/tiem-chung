import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandIconByName } from "@/components/icons/brand-icons";
import { PageHeader } from "@/components/site/page-header";
import { SectionTitle } from "@/components/ui/section-title";
import { PackageBuilder } from "@/components/vaccine/package-builder";
import { PackageCard } from "@/components/vaccine/package-card";
import { getPackageDetail, getPackages } from "@/lib/data/catalog";

export async function generateStaticParams() {
  return (await getPackages()).map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PageProps<"/goi-vac-xin/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageDetail(slug);
  return pkg ? { title: pkg.name, description: pkg.description ?? `${pkg.name} tại Trung tâm Tiêm chủng Tâm Trí.` } : {};
}

export default async function PackageDetailPage({ params }: PageProps<"/goi-vac-xin/[slug]">) {
  const { slug } = await params;
  const [pkg, packages] = await Promise.all([getPackageDetail(slug), getPackages()]);
  if (!pkg) notFound();
  const others = packages.filter((item) => item.slug !== pkg.slug && item.kind === pkg.kind).slice(0, 4);

  return (
    <main className="flex-1">
      <PageHeader title={pkg.name} description={pkg.description} crumbs={[{ label: "Gói vắc xin", href: "/goi-vac-xin" }, { label: pkg.name }]}>
        <span className="inline-flex items-center gap-2 rounded-full bg-white py-1 pr-4 pl-1 text-sm font-bold text-brand-800">
          <BrandIconByName name={pkg.icon} className="size-8" />
          {pkg.audienceLabel}
        </span>
      </PageHeader>
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <PackageBuilder pkg={pkg} />
        </div>
      </section>
      {others.length > 0 && (
        <section className="py-4 tab:py-6 desk:py-8">
          <div className="container-site">
            <SectionTitle title="Gói khác bạn có thể quan tâm" />
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 tab:mx-0 tab:grid tab:grid-cols-2 tab:overflow-visible tab:p-0 desk:grid-cols-4 desk:gap-4">
              {others.map((item) => (
                <li key={item.slug} className="w-[74%] max-w-[280px] shrink-0 snap-start tab:w-auto tab:max-w-none">
                  <PackageCard pkg={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
