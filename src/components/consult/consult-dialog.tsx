"use client";

import { CONSULT_HASH } from "@/lib/routes";

import { TextAreaField, TextField, SelectField } from "../forms/form-fields";
import { HashDialog } from "../forms/hash-dialog";
import { AdvisorIcon } from "../icons/brand-icons";
import { buttonClasses } from "../ui/button-link";

/** "Yêu cầu tư vấn" popup (spec page 11), opened by any link to `#tu-van`. */
export function ConsultDialog() {
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
          method="post"
          className="grid gap-4 px-6 py-6"
          onSubmit={(event) => {
            // No backend yet; the CMS "Yêu cầu tư vấn" collection will receive this.
            event.preventDefault();
            onSent();
          }}
        >
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
          <button type="submit" className={`${buttonClasses("primary", "lg")} mt-1 w-full`}>
            Gửi yêu cầu
          </button>
        </form>
      )}
    </HashDialog>
  );
}
