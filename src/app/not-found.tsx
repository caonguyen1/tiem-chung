import type { Metadata } from "next";

import { BrandIconByName } from "@/components/icons/brand-icons";
import { SiteShell } from "@/components/site/site-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { CONSULT_HASH } from "@/lib/routes";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

/** 404 for every unknown address and for slugs the database does not have (`notFound()`). */
export default function NotFound() {
  return (
    <SiteShell>
      <main className="flex flex-1 items-center py-10 tab:py-16">
        <div className="container-site">
          <div className="mx-auto grid max-w-[560px] justify-items-center gap-3 rounded-box bg-white px-5 py-10 text-center ring-1 ring-line ring-inset tab:px-10 tab:py-14">
            <BrandIconByName name="syringe" className="size-20" />
            <p className="text-[56px] leading-none font-bold text-brand-600 tab:text-[72px]">404</p>
            <h1 className="text-xl font-bold text-brand-800 tab:text-2xl">Không tìm thấy trang bạn cần</h1>
            <p className="text-[15px] text-body">Đường dẫn có thể đã thay đổi hoặc nội dung không còn nữa. Bạn thử quay về trang chủ hoặc xem danh mục vắc xin nhé.</p>
            <div className="mt-2 grid w-full gap-2.5 tab:flex tab:w-auto">
              <ButtonLink href="/vac-xin" variant="secondary">
                Xem vắc xin
              </ButtonLink>
              <ButtonLink href="/">Về trang chủ</ButtonLink>
              <ButtonLink href={CONSULT_HASH} variant="secondary">
                Yêu cầu tư vấn
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
