import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import { brandIcons } from "@/components/icons/brand-icons";
import type { schema } from "@/db";
import { saveAgeGroup, saveDiseaseGroup } from "@/lib/actions/admin/categories";

type Group = typeof schema.diseaseGroups.$inferSelect;
type Age = typeof schema.ageGroups.$inferSelect;

const iconLabels: Record<string, string> = {
  hpv: "HPV", lungs: "Phổi (phế cầu)", influenza: "Cúm", mosquito: "Muỗi (sốt xuất huyết, viêm não)", hand: "Bàn tay (tay chân miệng)", rotavirus: "Rotavirus", baby: "Em bé (6 trong 1)", rash: "Phát ban (sởi, quai bị)",
  blister: "Bọng nước (thủy đậu)", liver: "Gan (viêm gan)", brain: "Não", virus: "Virus (RSV)", syringe: "Ống tiêm", shield: "Khiên", stethoscope: "Ống nghe", pulse: "Nhịp tim", pregnancy: "Mang thai", heartPlus: "Trái tim", rings: "Nhẫn cưới",
  advisor: "Tư vấn", doctorChat: "Chat bác sĩ", location: "Vị trí", book: "Sách", calendar: "Lịch", package: "Gói", timer: "Đồng hồ", reminder: "Nhắc lịch",
};

export function DiseaseGroupForm({ group }: { group?: Group }) {
  return (
    <AdminForm action={saveDiseaseGroup} cancelHref="/admin/danh-muc" submitLabel={group ? "Lưu thay đổi" : "Thêm nhóm bệnh"}>
      <input type="hidden" name="id" value={group?.id ?? ""} />
      <Section title="Nhóm bệnh">
        <TextInput label="Tên nhóm bệnh" name="name" defaultValue={group?.name} required maxLength={120} />
        <TextInput label="Tên ngắn" name="shortName" defaultValue={group?.shortName} required maxLength={40} hint="Hiện ở ô nhỏ trên trang chủ." />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={group?.slug} maxLength={80} hint="Để trống thì tự tạo từ tên. Địa chỉ: /vac-xin/nhom-benh/<slug>." />
        <Select label="Biểu tượng" name="icon" defaultValue={group?.icon ?? "syringe"} required>
          {Object.keys(brandIcons).map((key) => (
            <option key={key} value={key}>
              {iconLabels[key] ?? key}
            </option>
          ))}
        </Select>
        <ImageField name="bannerImage" label="Ảnh banner nhóm bệnh" ratio={[3, 1]} width={1800} value={group?.bannerImage} hint="Không bắt buộc." />
      </Section>
      <Section title="Hiển thị">
        <Check name="featured" label="Hiện ở khối “Vắc xin theo bệnh” trên trang chủ" defaultChecked={group?.featured} />
        <Check name="isVisible" label="Hiện trên website" defaultChecked={group?.isVisible ?? true} />
      </Section>
    </AdminForm>
  );
}

export function AgeGroupForm({ age }: { age?: Age }) {
  return (
    <AdminForm action={saveAgeGroup} cancelHref="/admin/danh-muc" submitLabel={age ? "Lưu thay đổi" : "Thêm khoảng tuổi"}>
      <input type="hidden" name="id" value={age?.id ?? ""} />
      <Section title="Khoảng tuổi">
        <TextInput label="Tên hiển thị" name="label" defaultValue={age?.label} required maxLength={60} hint='Ví dụ: "0 – 6 tháng".' />
        <TextInput label="Mã (slug)" name="slug" defaultValue={age?.slug} maxLength={60} hint="Để trống thì tự tạo từ tên." />
        <Check name="isVisible" label="Hiện trên website" defaultChecked={age?.isVisible ?? true} />
      </Section>
    </AdminForm>
  );
}
