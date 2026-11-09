import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WhySection } from "@/components/homepage/why-section";
import { PageHeader } from "@/components/site/page-header";
import { PackageExplorer } from "@/components/vaccine/package-explorer";
import { getPackageDetail, getPackages } from "@/lib/data/catalog";
import { getWhyChooseUs } from "@/lib/data/settings";

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
  const [pkg, packages, why] = await Promise.all([getPackageDetail(slug), getPackages(), getWhyChooseUs()]);
  if (!pkg) notFound();

  return (
    <main className="flex-1">
      <PageHeader
        art="package"
        title="Gói vắc xin"
        description="Lịch tiêm trọn gói do bác sĩ sắp xếp sẵn theo độ tuổi hoặc theo đối tượng, giá gói thấp hơn tổng giá tiêm lẻ."
        crumbs={[{ label: "Gói vắc xin", href: "/goi-vac-xin" }, { label: pkg.name }]}
      />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <PackageExplorer packages={packages} active={pkg} />
        </div>
      </section>
      <WhySection items={why} />
    </main>
  );
}
