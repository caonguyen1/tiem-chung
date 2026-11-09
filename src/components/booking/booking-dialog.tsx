"use client";

import { BOOKING_HASH } from "@/lib/routes";

import { HashDialog } from "../forms/hash-dialog";
import { SyringeIcon } from "../icons/brand-icons";
import { BookingForm, type BookingOption } from "./booking-form";

type BookingDialogProps = {
  vaccines: BookingOption[];
  packages: BookingOption[];
  centers: BookingOption[];
};

/**
 * "Đặt hẹn" popup (spec page 10). `#dat-lich` opens it empty; `#dat-lich=<slug>`
 * preselects that vaccine or package. Saves to the "Lịch đặt hẹn" table.
 */
export function BookingDialog({ vaccines, packages, centers }: BookingDialogProps) {
  return (
    <HashDialog
      hash={BOOKING_HASH}
      title="Đặt lịch tiêm"
      description="Chọn vắc xin và ngày mong muốn, Tâm Trí sẽ gọi xác nhận lịch hẹn cho bạn."
      icon={<SyringeIcon bare className="size-14" />}
      successTitle="Đã nhận lịch hẹn của bạn"
      successText="Tâm Trí sẽ gọi điện xác nhận lịch hẹn sớm nhất."
    >
      {({ param, onSent }) => (
        // Re-mount on a new preselection so the select picks it up.
        <BookingForm key={param ?? "none"} vaccines={vaccines} packages={packages} centers={centers} preselect={param} onSent={onSent} className="grid gap-4 px-6 py-6" />
      )}
    </HashDialog>
  );
}
