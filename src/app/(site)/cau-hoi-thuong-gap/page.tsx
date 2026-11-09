import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { getFaqs } from "@/lib/data/content";
import { CONSULT_HASH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Giải đáp những câu hỏi thường gặp về tiêm chủng tại Trung tâm Tiêm chủng Tâm Trí.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <main className="flex-1">
      <PageHeader art="faq" title="Câu hỏi thường gặp" description="Chưa thấy câu trả lời bạn cần? Gửi yêu cầu, bác sĩ sẽ gọi lại tư vấn." crumbs={[{ label: "Câu hỏi thường gặp" }]}>
        <ButtonLink href={CONSULT_HASH} variant="primary">
          Yêu cầu tư vấn
        </ButtonLink>
      </PageHeader>
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <div className="mx-auto max-w-[860px]">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
