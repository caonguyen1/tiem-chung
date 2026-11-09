import type { Metadata } from "next";

import { WhySection } from "@/components/homepage/why-section";
import { PageHeader } from "@/components/site/page-header";
import { SectionTitle } from "@/components/ui/section-title";
import { PackageCard } from "@/components/vaccine/package-card";
import { getPackages } from "@/lib/data/catalog";
import { getWhyChooseUs } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Gói vắc xin",
  description: "Gói vắc xin theo độ tuổi và theo đối tượng tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function PackagesPage() {
  const [packages, why] = await Promise.all([getPackages(), getWhyChooseUs()]);
  const byAge = packages.filter((pkg) => pkg.kind === "age");
  const byAudience = packages.filter((pkg) => pkg.kind === "audience");
  return (
    <main className="flex-1">
      <PageHeader art="package"
        title="Gói vắc xin"
        description="Lịch tiêm trọn gói do bác sĩ sắp xếp sẵn theo độ tuổi hoặc theo đối tượng, giá gói thấp hơn tổng giá tiêm lẻ."
        crumbs={[{ label: "Gói vắc xin" }]}
      />
      <section id="theo-do-tuoi" className="scroll-mt-4 py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <SectionTitle title="Gói theo độ tuổi" description="Từ 3 tháng tuổi đến người trưởng thành." />
          <Grid packages={byAge} />
        </div>
      </section>
      <section id="theo-doi-tuong" className="scroll-mt-4 py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <SectionTitle title="Gói theo đối tượng" description="Tiền hôn nhân, chuẩn bị mang thai, mang thai và bệnh mạn tính." />
          <Grid packages={byAudience} />
        </div>
      </section>
      <WhySection items={why} />
    </main>
  );
}

function Grid({ packages }: { packages: Awaited<ReturnType<typeof getPackages>> }) {
  return (
    <ul className="grid gap-3 tab:grid-cols-2 desk:grid-cols-4 desk:gap-4">
      {packages.map((pkg) => (
        <li key={pkg.slug}>
          <PackageCard pkg={pkg} />
        </li>
      ))}
    </ul>
  );
}
