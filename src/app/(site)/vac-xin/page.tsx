import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { VaccineCatalog } from "@/components/vaccine/vaccine-catalog";
import { getAgeGroups, getDiseaseGroups, getPackages, getVaccines } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Vắc xin phòng bệnh",
  description: "Danh mục vắc xin lẻ và gói vắc xin tại Trung tâm Tiêm chủng Tâm Trí. Lọc theo độ tuổi, bệnh, nơi sản xuất và số liều.",
};

export default async function VaccineCatalogPage() {
  const [vaccines, packages, groups, ageGroups] = await Promise.all([getVaccines(), getPackages(), getDiseaseGroups(), getAgeGroups()]);
  return (
    <main className="flex-1">
      <PageHeader art="vaccine"
        title="Vắc xin phòng bệnh"
        description="Vắc xin chính hãng, bác sĩ khám sàng lọc trước mỗi mũi tiêm. Chọn theo độ tuổi, loại bệnh hoặc xem các gói vắc xin."
        crumbs={[{ label: "Vắc xin phòng bệnh" }]}
      />
      <VaccineCatalog vaccines={vaccines} packages={packages} groups={groups} ageGroups={ageGroups} />
    </main>
  );
}
