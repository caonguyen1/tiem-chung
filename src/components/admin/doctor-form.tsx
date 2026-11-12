import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, SeoFields, TextArea, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import type { schema } from "@/db";
import { saveDoctor } from "@/lib/actions/admin/doctors";

type Doctor = typeof schema.doctors.$inferSelect;

export function DoctorForm({ doctor }: { doctor?: Doctor }) {
  return (
    <AdminForm action={saveDoctor} cancelHref="/admin/doi-ngu" submitLabel={doctor ? "Lưu thay đổi" : "Thêm bác sĩ"}>
      <input type="hidden" name="id" value={doctor?.id ?? ""} />
      <Section title="Thông tin">
        <div className="grid gap-4 tab:grid-cols-[160px_1fr]">
          <TextInput label="Học vị" name="title" defaultValue={doctor?.title} required maxLength={40} hint="BSCKII., ThS. BS.…" />
          <TextInput label="Họ và tên" name="name" defaultValue={doctor?.name} required maxLength={120} />
        </div>
        <TextInput label="Chuyên khoa / chức danh" name="specialty" defaultValue={doctor?.specialty} required maxLength={160} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={doctor?.slug} maxLength={80} hint="Để trống thì tự tạo từ họ tên." />
        <ImageField name="photo" label="Ảnh chân dung" ratio={[1, 1]} width={800} value={doctor?.photo} hint="Ảnh vuông, nên thấy rõ khuôn mặt." />
      </Section>
      <Section title="Giới thiệu">
        <TextArea label="Câu nói tiêu biểu" name="quote" defaultValue={doctor?.quote ?? ""} rows={2} maxLength={400} />
        <TextArea label="Tiểu sử" name="bio" defaultValue={doctor?.bio ?? ""} rows={6} maxLength={6000} hint="Dòng trống = đoạn mới." />
        <TextArea label="Kinh nghiệm" name="experience" defaultValue={doctor?.experience ?? ""} rows={5} maxLength={6000} hint="Mỗi dòng là một gạch đầu dòng." />
      </Section>
      <Section title="Hiển thị">
        <Check name="isVisible" label="Hiện trên website" defaultChecked={doctor?.isVisible ?? true} />
      </Section>
      <SeoFields title={doctor?.seoTitle} description={doctor?.seoDescription} />
    </AdminForm>
  );
}
