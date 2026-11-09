"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { ButtonLink } from "../ui/button-link";
import { BookingForm, type BookingOption } from "./booking-form";

type Props = { vaccines: BookingOption[]; packages: BookingOption[]; centers: BookingOption[] };

/** The `/dat-hen` page body: the same form as the popup, with what happens next beside it. */
export function BookingPage({ vaccines, packages, centers }: Props) {
  const [sent, setSent] = useState(false);

  return (
    <div className="grid gap-3 desk:grid-cols-[minmax(0,1fr)_360px] desk:items-start desk:gap-5">
      <div className="rounded-box bg-white p-4 tab:p-6 desk:p-8">
        {sent ? (
          <div className="flex flex-col items-center px-2 py-10 text-center">
            <CheckCircle2 aria-hidden="true" className="size-14 text-brand-bright" />
            <h2 className="mt-3 text-2xl font-bold text-brand-800">Đã nhận lịch hẹn của bạn</h2>
            <p className="mt-1 text-body">Tâm Trí sẽ gọi điện xác nhận lịch hẹn sớm nhất.</p>
            <ButtonLink href="/" variant="secondary" className="mt-5">
              Về trang chủ
            </ButtonLink>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-brand-800 desk:text-2xl">Thông tin đặt hẹn</h2>
            <BookingForm vaccines={vaccines} packages={packages} centers={centers} onSent={() => setSent(true)} className="mt-4 grid gap-4" />
          </>
        )}
      </div>
      <aside className="rounded-box bg-white p-4 tab:p-6">
        <h2 className="text-lg font-bold text-brand-800">Sau khi gửi lịch hẹn</h2>
        <ol className="mt-3 grid gap-3 text-[15px] text-body">
          {["Nhân viên Tâm Trí gọi điện xác nhận ngày giờ.", "Bạn đến trung tâm, bác sĩ khám sàng lọc trước khi tiêm.", "Ở lại theo dõi 30 phút sau tiêm, nhận hướng dẫn chăm sóc và lịch nhắc mũi kế tiếp."].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg bg-surface-soft px-3 py-2 text-[13px] text-subtle">Chỉ định tiêm do bác sĩ quyết định sau khi khám sàng lọc.</p>
      </aside>
    </div>
  );
}
