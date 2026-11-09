import type { Metadata } from "next";

import { BookingPage } from "@/components/booking/booking-page";
import { PageHeader } from "@/components/site/page-header";
import { getPackages, getVaccines } from "@/lib/data/catalog";
import { getCenters } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Đặt hẹn tiêm chủng",
  description: "Đặt lịch tiêm chủng tại Trung tâm Tiêm chủng Tâm Trí. Nhân viên sẽ gọi xác nhận lịch hẹn cho bạn.",
};

export default async function BookingRoute() {
  const [vaccines, packages, centers] = await Promise.all([getVaccines(), getPackages(), getCenters()]);
  return (
    <main className="flex-1">
      <PageHeader art="booking" title="Đặt hẹn tiêm chủng" description="Chọn vắc xin hoặc gói và ngày mong muốn. Tâm Trí sẽ gọi xác nhận lịch hẹn cho bạn." crumbs={[{ label: "Đặt hẹn" }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <BookingPage vaccines={vaccines} packages={packages} centers={centers} />
        </div>
      </section>
    </main>
  );
}
