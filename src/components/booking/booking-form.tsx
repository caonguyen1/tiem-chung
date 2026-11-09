"use client";

import { useState } from "react";

import { submitAppointment } from "@/lib/actions/requests";

import { SelectField, TextAreaField, TextField } from "../forms/form-fields";
import { buttonClasses } from "../ui/button-link";

export type BookingOption = { slug: string; name: string };

type BookingFormProps = {
  vaccines: BookingOption[];
  packages: BookingOption[];
  centers: BookingOption[];
  /** Slug of the vaccine or package that starts selected. */
  preselect?: string | null;
  onSent: () => void;
  className?: string;
};

/** The appointment form shared by the `#dat-lich` popup and the `/dat-hen` page. Saves to "Lịch đặt hẹn". */
export function BookingForm({ vaccines, packages, centers, preselect, onSent, className = "grid gap-4" }: BookingFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className={className}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        setPending(true);
        setError("");
        const result = await submitAppointment(new FormData(form));
        setPending(false);
        if (result.ok) onSent();
        else setError(result.error);
      }}
    >
      <TextField label="Họ và tên người tiêm" name="name" autoComplete="name" required />
      <TextField label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
      <SelectField label="Vắc xin / gói vắc xin" name="item" defaultValue={preselect ?? ""}>
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
  );
}
