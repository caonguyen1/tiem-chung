import type { Metadata } from "next";

import { CenterFinder } from "@/components/site/center-finder";
import { PageHeader } from "@/components/site/page-header";
import { getCenters } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Hệ thống trung tâm",
  description: "Địa chỉ, giờ hoạt động và đường đi tới các trung tâm tiêm chủng Tâm Trí.",
};

export default async function CentersPage() {
  const centers = await getCenters();
  return (
    <main className="flex-1">
      <PageHeader art="center" title="Hệ thống trung tâm" description="Tìm trung tâm tiêm chủng Tâm Trí gần bạn." crumbs={[{ label: "Hệ thống trung tâm" }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <CenterFinder centers={centers} />
        </div>
      </section>
    </main>
  );
}
