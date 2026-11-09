import type { Metadata } from "next";

import { DoctorCard } from "@/components/site/doctor-card";
import { PageHeader } from "@/components/site/page-header";
import { getDoctors } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Đội ngũ chuyên môn",
  description: "Đội ngũ bác sĩ khám sàng lọc và tư vấn tiêm chủng tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return (
    <main className="flex-1">
      <PageHeader art="team"
        title="Đội ngũ chuyên môn"
        description="Bác sĩ khám sàng lọc trước mỗi mũi tiêm và kiểm duyệt nội dung chuyên môn trên website."
        crumbs={[{ label: "Đội ngũ chuyên môn" }]}
      />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <ul className="grid grid-cols-2 gap-3 tab:grid-cols-3 desk:grid-cols-4 desk:gap-5">
            {doctors.map((doctor) => (
              <li key={doctor.slug}>
                <DoctorCard doctor={doctor} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
