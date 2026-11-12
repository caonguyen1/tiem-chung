import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, SeoFields, TextArea, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import { PackageItemsField } from "@/components/admin/package-items-field";
import { brandIcons } from "@/components/icons/brand-icons";
import type { schema } from "@/db";
import { savePackage } from "@/lib/actions/admin/packages";

type Package = typeof schema.vaccinePackages.$inferSelect;

/** Create / edit form of a vaccine package. */
export function PackageForm({
  pkg,
  vaccines,
  items,
}: {
  pkg?: Package;
  vaccines: { id: number; name: string; price: number }[];
  items?: { vaccineId: number; doses: number }[];
}) {
  return (
    <AdminForm action={savePackage} cancelHref="/admin/goi-vac-xin" submitLabel={pkg ? "Lưu thay đổi" : "Thêm gói"}>
      <input type="hidden" name="id" value={pkg?.id ?? ""} />
      <Section title="Thông tin gói">
        <TextInput label="Tên gói" name="name" defaultValue={pkg?.name} required maxLength={120} />
        <div className="grid gap-4 tab:grid-cols-2">
          <Select label="Loại gói" name="kind" defaultValue={pkg?.kind ?? "age"} required hint="Quyết định gói nằm ở nhóm “Theo độ tuổi” hay “Theo đối tượng”.">
            <option value="age">Theo độ tuổi</option>
            <option value="audience">Theo đối tượng</option>
          </Select>
          <TextInput label="Độ tuổi / đối tượng" name="audienceLabel" defaultValue={pkg?.audienceLabel} required maxLength={80} hint='Ví dụ: "0 – 6 tháng", "Phụ nữ mang thai".' />
        </div>
        <Select label="Biểu tượng" name="icon" defaultValue={pkg?.icon ?? "package"} required>
          {Object.keys(brandIcons).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
        <TextArea label="Mô tả" name="description" defaultValue={pkg?.description ?? ""} rows={3} maxLength={600} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={pkg?.slug} maxLength={80} hint="Để trống thì tự tạo từ tên. Địa chỉ: /goi-vac-xin/<slug>." />
        <ImageField name="image" label="Ảnh minh họa" ratio={[1, 1]} width={900} value={pkg?.image} hint="Không bắt buộc." />
      </Section>

      <Section title="Vắc xin trong gói" description="Chọn vắc xin và số mũi. Số mũi, số loại vắc xin và giá gốc của gói tự tính từ danh sách này.">
        <PackageItemsField vaccines={vaccines} initial={items ?? []} />
      </Section>

      <Section title="Giá và nhãn">
        <TextInput label="Giá gói (đồng)" name="price" type="number" min={0} step={1000} defaultValue={pkg?.price} required />
        <TextInput label="Nhãn nổi bật" name="highlight" defaultValue={pkg?.highlight ?? ""} maxLength={40} hint='Ví dụ: "Phổ biến nhất". Có nhãn thì thẻ gói có viền vàng.' />
      </Section>

      <Section title="Hiển thị">
        <Check name="isVisible" label="Hiện trên website" defaultChecked={pkg?.isVisible ?? true} />
      </Section>
      <SeoFields title={pkg?.seoTitle} description={pkg?.seoDescription} />
    </AdminForm>
  );
}
