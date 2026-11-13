"use client";

import { useState } from "react";

import { submitConsultRequest } from "@/lib/actions/requests";
import { CONSULT_HASH } from "@/lib/routes";

import { SelectField, TextAreaField, TextField } from "../forms/form-fields";
import { HashDialog } from "../forms/hash-dialog";
import { AdvisorIcon } from "../icons/brand-icons";
import { buttonClasses } from "../ui/button-link";

/** "Yêu cầu tư vấn" popup (spec page 11), opened by any link to `#tu-van`. Saves to "Yêu cầu tư vấn". */
export function ConsultDialog() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <HashDialog
      hash={CONSULT_HASH}
      title="Yêu cầu tư vấn"
      description="Để lại thông tin, chuyên viên Tâm Trí sẽ gọi lại cho bạn sớm nhất."
      icon={<AdvisorIcon bare className="size-14" />}
      successTitle="Đã nhận yêu cầu của bạn"
      successText="Tâm Trí sẽ liên hệ lại sớm nhất."
    >
      {({ onSent }) => (
        <form
          className="grid gap-4 px-6 py-6"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            setError("");
            const result = await submitConsultRequest(new FormData(event.currentTarget));
            setPending(false);
            if (result.ok) onSent();
            else setError(result.error);
          }}
        >
          {/* Trap for bots: invisible and skipped by keyboards; a filled value means it is not a person. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <TextField label="Họ và tên" name="name" autoComplete="name" required />
          <TextField label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          <SelectField label="Bạn cần tư vấn về" name="topic">
            <option>Vắc xin cho trẻ em</option>
            <option>Vắc xin trước và trong thai kỳ</option>
            <option>Vắc xin cho người lớn</option>
            <option>Gói vắc xin</option>
            <option>Khác</option>
          </SelectField>
          <TextAreaField label="Ghi chú" name="note" rows={3} />
          {error && (
            <p role="alert" className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending} className={`${buttonClasses("primary", "lg")} mt-1 w-full disabled:opacity-60`}>
            {pending ? "Đang gửi…" : "Gửi yêu cầu"}
          </button>
        </form>
      )}
    </HashDialog>
  );
}
