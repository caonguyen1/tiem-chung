"use client";

import { ButtonLink } from "@/components/ui/button-link";

/** Shown inside the site shell when a page fails to render (for example the database is down). */
export default function SiteError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex flex-1 items-center py-10 tab:py-16">
      <div className="container-site">
        <div className="mx-auto grid max-w-[560px] justify-items-center gap-3 rounded-box bg-white px-5 py-10 text-center ring-1 ring-line ring-inset tab:px-10 tab:py-14">
          <h1 className="text-xl font-bold text-brand-800 tab:text-2xl">Trang tạm thời chưa mở được</h1>
          <p className="text-[15px] text-body">Đã có lỗi khi tải trang. Bạn thử tải lại, hoặc gọi tổng đài để được hỗ trợ.</p>
          <div className="mt-2 grid w-full gap-2.5 tab:flex tab:w-auto">
            <button type="button" onClick={() => retry()} className="inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-6 text-[15px] font-bold text-white hover:bg-brand-700">
              Tải lại trang
            </button>
            <ButtonLink href="/" variant="secondary">
              Về trang chủ
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
