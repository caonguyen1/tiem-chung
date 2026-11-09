import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WhySection } from "@/components/homepage/why-section";
import { PageHeader } from "@/components/site/page-header";
import { PackageExplorer } from "@/components/vaccine/package-explorer";
import { getPackageDetail, getPackages } from "@/lib/data/catalog";
import { getWhyChooseUs } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Gói vắc xin",
  description: "Gói vắc xin theo độ tuổi và theo đối tượng tại Trung tâm Tiêm chủng Tâm Trí.",
};

/** `/goi-vac-xin` opens the first package; `/goi-vac-xin/<slug>` opens a specific one. */
export default async function PackagesPage() {
  const [packages, why] = await Promise.all([getPackages(), getWhyChooseUs()]);
  const first = packages[0] && (await getPackageDetail(packages[0].slug));
  if (!first) notFound();
  return (
    <main className="flex-1">
      <PageHeader
        art="package"
        title="Gói vắc xin"
        description="Lịch tiêm trọn gói do bác sĩ sắp xếp sẵn theo độ tuổi hoặc theo đối tượng, giá gói thấp hơn tổng giá tiêm lẻ."
        crumbs={[{ label: "Gói vắc xin" }]}
      />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <PackageExplorer packages={packages} active={first} />
        </div>
      </section>
      <WhySection items={why} />
    </main>
  );
}
