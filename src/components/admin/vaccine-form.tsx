import { AdminForm } from "@/components/admin/admin-form";
import { Check, CheckList, Section, Select, SeoFields, TextArea, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import type { schema } from "@/db";
import { saveVaccine } from "@/lib/actions/admin/vaccines";
import { FAQ_SLOTS, GALLERY_SLOTS, vaccineSectionDefs } from "@/lib/admin/vaccine-sections";

type Vaccine = typeof schema.vaccines.$inferSelect;

type Props = {
  vaccine?: Vaccine;
  diseaseGroups: { id: number; name: string }[];
  ageGroups: { id: number; label: string }[];
  doctors: { id: number; title: string; name: string }[];
  selectedGroups?: number[];
  selectedAges?: number[];
};

/** Create / edit form of a vaccine. */
export function VaccineForm({ vaccine, diseaseGroups, ageGroups, doctors, selectedGroups, selectedAges }: Props) {
  const sections = new Map((vaccine?.content ?? []).map((section) => [section.key, section.body]));
  return (
    <AdminForm action={saveVaccine} cancelHref="/admin/vac-xin" submitLabel={vaccine ? "Lưu thay đổi" : "Thêm vắc xin"}>
      <input type="hidden" name="id" value={vaccine?.id ?? ""} />

      <Section title="Thông tin cơ bản">
        <TextInput label="Tên vắc xin" name="name" defaultValue={vaccine?.name} required maxLength={120} />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={vaccine?.slug} maxLength={80} hint="Để trống thì tự tạo từ tên. Địa chỉ trang: /vac-xin/<slug>." />
        <TextInput label="Phòng bệnh" name="prevents" defaultValue={vaccine?.prevents} required maxLength={300} hint="Một câu ngắn, hiện dưới tên vắc xin ở thẻ." />
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Nước sản xuất" name="origin" defaultValue={vaccine?.origin} required maxLength={60} hint="Dùng cho bộ lọc “Nơi sản xuất”." />
          <TextInput label="Nhà sản xuất" name="manufacturer" defaultValue={vaccine?.manufacturer} required maxLength={80} />
        </div>
        <TextInput label="Đối tượng tiêm" name="audience" defaultValue={vaccine?.audience} required maxLength={200} hint='Ví dụ: "Nam, nữ 9–45 tuổi".' />
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Đơn vị" name="unit" defaultValue={vaccine?.unit ?? ""} maxLength={80} hint='Ví dụ: "Liều 0,5 ml".' />
          <TextInput label="Số liều (một phác đồ đầy đủ)" name="doseCount" type="number" min={1} max={20} defaultValue={vaccine?.doseCount ?? ""} hint="Dùng cho bộ lọc “Số liều”." />
        </div>
      </Section>

      <Section title="Giá và trạng thái">
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Giá (đồng)" name="price" type="number" min={0} step={1000} defaultValue={vaccine?.price} required />
          <TextInput label="Giá gốc (đồng)" name="originalPrice" type="number" min={0} step={1000} defaultValue={vaccine?.originalPrice ?? ""} hint="Chỉ điền khi đang giảm giá." />
        </div>
        <Select label="Trạng thái" name="status" defaultValue={vaccine?.status ?? "book"} required hint="Quyết định nút trên thẻ vắc xin.">
          <option value="book">Đặt hẹn (nút “Đặt lịch”)</option>
          <option value="preorder">Đặt trước (nút “Đặt trước”)</option>
          <option value="consult">Cần tư vấn (nút “Cần tư vấn”)</option>
        </Select>
        <p className="text-[13px] text-subtle">Đổi giá vắc xin sẽ tự cập nhật giá gốc của các gói có chứa vắc xin này.</p>
      </Section>

      <Section title="Phân loại" description="Dùng cho bộ lọc và trang nhóm bệnh.">
        <CheckList label="Nhóm bệnh" name="diseaseGroupIds" options={diseaseGroups.map((group) => ({ value: group.id, label: group.name }))} selected={selectedGroups} />
        <CheckList label="Độ tuổi tiêm được" name="ageGroupIds" options={ageGroups.map((age) => ({ value: age.id, label: age.label }))} selected={selectedAges} />
      </Section>

      <Section title="Hình ảnh" description="Ảnh đầu tiên là ảnh chính. Để trống thì website vẽ lọ vắc xin minh họa.">
        <div className="grid gap-5 tab:grid-cols-2">
          {Array.from({ length: GALLERY_SLOTS }, (_, index) => (
            <ImageField key={index} name={`gallery${index}`} label={index === 0 ? "Ảnh chính" : `Ảnh ${index + 1}`} ratio={[1, 1]} width={900} value={vaccine?.gallery[index]} />
          ))}
        </div>
      </Section>

      <Section title="Nội dung chi tiết" description="Mỗi mục là một khối trên trang chi tiết; mục để trống sẽ không hiện. Cách viết: dòng trống = đoạn mới; dòng bắt đầu bằng “- ” = gạch đầu dòng.">
        {vaccineSectionDefs.map((section) => (
          <TextArea key={section.key} label={section.title} name={`section_${section.key}`} defaultValue={sections.get(section.key) ?? ""} rows={5} maxLength={20000} />
        ))}
      </Section>

      <Section title="Câu hỏi thường gặp" description="Cặp câu hỏi và trả lời nào để trống một ô sẽ bị bỏ qua.">
        {Array.from({ length: FAQ_SLOTS }, (_, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-line p-3">
            <TextInput label={`Câu hỏi ${index + 1}`} name={`faqQ${index}`} defaultValue={vaccine?.faqs[index]?.question ?? ""} maxLength={300} />
            <TextArea label="Trả lời" name={`faqA${index}`} defaultValue={vaccine?.faqs[index]?.answer ?? ""} rows={3} maxLength={3000} />
          </div>
        ))}
      </Section>

      <Section title="Kiểm duyệt và hiển thị">
        <Select label="Bác sĩ kiểm duyệt" name="reviewerId" defaultValue={vaccine?.reviewerId ?? ""}>
          <option value="">Không có</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.title} {doctor.name}
            </option>
          ))}
        </Select>
        <Check name="isVisible" label="Hiện trên website" defaultChecked={vaccine?.isVisible ?? true} />
      </Section>
      <SeoFields title={vaccine?.seoTitle} description={vaccine?.seoDescription} />
    </AdminForm>
  );
}
