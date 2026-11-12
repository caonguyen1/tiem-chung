import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, SeoFields, TextInput } from "@/components/admin/admin-fields";
import type { schema } from "@/db";
import { saveCategory } from "@/lib/actions/admin/articles";

type Category = typeof schema.articleCategories.$inferSelect;

export function CategoryForm({ category }: { category?: Category }) {
  return (
    <AdminForm action={saveCategory} cancelHref="/admin/bai-viet/chuyen-muc" submitLabel={category ? "Lưu thay đổi" : "Thêm chuyên mục"}>
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <Section title="Chuyên mục">
        <TextInput label="Tên chuyên mục" name="name" defaultValue={category?.name} required maxLength={80} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={category?.slug} maxLength={80} hint="Để trống thì tự tạo từ tên. Địa chỉ: /kien-thuc/<slug>." />
        <Check name="isPromotion" label="Đây là chuyên mục Khuyến mãi" hint="Bài trong chuyên mục này hiện ở trang Khuyến mãi, không hiện ở Kiến thức." defaultChecked={category?.isPromotion} />
        <Check name="isVisible" label="Hiện trên website" defaultChecked={category?.isVisible ?? true} />
      </Section>
      <SeoFields title={category?.seoTitle} description={category?.seoDescription} />
    </AdminForm>
  );
}
