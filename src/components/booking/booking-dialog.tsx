"use client";

import { useState } from "react";

import { submitAppointment } from "@/lib/actions/requests";
import { BOOKING_HASH } from "@/lib/routes";

import { SelectField, TextAreaField, TextField } from "../forms/form-fields";
import { HashDialog } from "../forms/hash-dialog";
import { SyringeIcon } from "../icons/brand-icons";
import { buttonClasses } from "../ui/button-link";

type Option = { slug: string; name: string };

type BookingDialogProps = {
  vaccines: Option[];
  packages: Option[];
  centers: Option[];
};

/**
 * "Đặt hẹn" popup (spec page 10). `#dat-lich` opens it empty; `#dat-lich=<slug>`
 * preselects that vaccine or package. Saves to the "Lịch đặt hẹn" table.
 */
export function BookingDialog({ vaccines, packages, centers }: BookingDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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
        <form
          // Re-mount on a new preselection so the select picks it up.
          key={param ?? "none"}
          className="grid gap-4 px-6 py-6"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            setError("");
            const result = await submitAppointment(new FormData(event.currentTarget));
            setPending(false);
            if (result.ok) onSent();
            else setError(result.error);
          }}
        >
          <TextField label="Họ và tên người tiêm" name="name" autoComplete="name" required />
          <TextField label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          <SelectField label="Vắc xin / gói vắc xin" name="item" defaultValue={param ?? ""}>
            <option value="">Chưa chọn – cần bác sĩ tư vấn</option>
            <optgroup label="Gói vắc xin">
              {packages.map((pkg) => (
                <option key={pkg.slug} value={pkg.slug}>
                  {pkg.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Vắc xin lẻ">
              {vaccines.map((vaccine) => (
                <option key={vaccine.slug} value={vaccine.slug}>
                  {vaccine.name}
                </option>
              ))}
            </optgroup>
          </SelectField>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Ngày mong muốn" name="date" type="date" required />
            <SelectField label="Trung tâm" name="center">
              {centers.map((center) => (
                <option key={center.slug} value={center.slug}>
                  {center.name}
                </option>
              ))}
            </SelectField>
          </div>
          <TextAreaField label="Ghi chú" name="note" rows={2} placeholder="Tuổi của bé, mũi đã tiêm…" />
          {error && (
            <p role="alert" className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending} className={`${buttonClasses("primary", "lg")} mt-1 w-full disabled:opacity-60`}>
            {pending ? "Đang gửi…" : "Gửi lịch hẹn"}
          </button>
        </form>
      )}
    </HashDialog>
  );
}
