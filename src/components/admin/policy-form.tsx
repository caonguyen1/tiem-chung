import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, SeoFields, TextArea, TextInput } from "@/components/admin/admin-fields";
import type { schema } from "@/db";
import { savePolicy } from "@/lib/actions/admin/policies";

type Policy = typeof schema.policyPages.$inferSelect;

/** Create / edit form of a policy page. */
export function PolicyForm({ policy }: { policy?: Policy }) {
  return (
    <AdminForm action={savePolicy} cancelHref="/admin/chinh-sach" submitLabel={policy ? "Lưu thay đổi" : "Thêm trang"}>
      <input type="hidden" name="id" value={policy?.id ?? ""} />
      <Section title="Nội dung">
        <TextInput label="Tiêu đề" name="title" defaultValue={policy?.title} required maxLength={160} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={policy?.slug} maxLength={80} hint="Để trống thì tự tạo từ tiêu đề. Địa chỉ trang: /chinh-sach/<slug>." />
        <TextArea
          label="Nội dung"
          name="body"
          defaultValue={policy?.body}
          rows={16}
          hint={'Cách viết: dòng trống = đoạn mới; "## Tiêu đề" = tiêu đề phụ; dòng bắt đầu bằng "- " = gạch đầu dòng.'}
        />
      </Section>
      <Section title="Hiển thị">
        <Check name="isVisible" label="Hiện trên website" defaultChecked={policy?.isVisible ?? true} />
      </Section>
      <SeoFields title={policy?.seoTitle} description={policy?.seoDescription} />
    </AdminForm>
  );
}
