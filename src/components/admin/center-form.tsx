import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, SeoFields, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import type { schema } from "@/db";
import { saveCenter } from "@/lib/actions/admin/centers";

type Center = typeof schema.centers.$inferSelect;

export function CenterForm({ center }: { center?: Center }) {
  return (
    <AdminForm action={saveCenter} cancelHref="/admin/trung-tam" submitLabel={center ? "Lưu thay đổi" : "Thêm trung tâm"}>
      <input type="hidden" name="id" value={center?.id ?? ""} />
      <Section title="Thông tin chung">
        <TextInput label="Tên trung tâm" name="name" defaultValue={center?.name} required maxLength={160} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={center?.slug} maxLength={80} hint="Để trống thì tự tạo từ tên. Địa chỉ trang: /he-thong-trung-tam/<slug>." />
        <TextInput label="Số điện thoại" name="phone" defaultValue={center?.phone} required maxLength={40} />
        <TextInput label="Giờ hoạt động" name="openingHours" defaultValue={center?.openingHours} required maxLength={120} hint='Ví dụ: "7:30 – 20:00 hằng ngày".' />
        <ImageField name="image" label="Ảnh trung tâm" ratio={[3, 2]} width={1200} value={center?.image} />
      </Section>
      <Section title="Địa chỉ">
        <TextInput label="Địa chỉ (mới)" name="address" defaultValue={center?.address} required maxLength={300} />
        <TextInput label="Địa chỉ (cũ, trước sáp nhập)" name="addressOld" defaultValue={center?.addressOld ?? ""} maxLength={300} />
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Tỉnh / Thành phố" name="province" defaultValue={center?.province ?? "Gia Lai"} required maxLength={80} />
          <TextInput label="Phường / Xã" name="ward" defaultValue={center?.ward ?? ""} maxLength={80} />
        </div>
      </Section>
      <Section title="Bản đồ" description="Tọa độ dùng cho tính năng “Trung tâm gần tôi”. Link nhúng lấy từ Google Maps (Chia sẻ → Nhúng bản đồ).">
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Vĩ độ" name="latitude" defaultValue={center?.latitude ?? ""} inputMode="decimal" />
          <TextInput label="Kinh độ" name="longitude" defaultValue={center?.longitude ?? ""} inputMode="decimal" />
        </div>
        <TextInput label="Link Google Maps (chỉ đường)" name="mapUrl" defaultValue={center?.mapUrl ?? ""} maxLength={600} />
        <TextInput label="Link nhúng bản đồ" name="mapEmbedUrl" defaultValue={center?.mapEmbedUrl ?? ""} maxLength={1200} hint="Để trống thì trang chi tiết hiện ảnh trung tâm." />
      </Section>
      <Section title="Hiển thị">
        <Check name="isVisible" label="Hiện trên website" defaultChecked={center?.isVisible ?? true} />
      </Section>
      <SeoFields title={center?.seoTitle} description={center?.seoDescription} />
    </AdminForm>
  );
}
