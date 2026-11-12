import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, TextArea, TextInput } from "@/components/admin/admin-fields";
import { brandIcons } from "@/components/icons/brand-icons";
import type { schema } from "@/db";
import { saveFaq, saveWhyChooseUs } from "@/lib/actions/admin/banners";

type Faq = typeof schema.faqs.$inferSelect;
type Why = { icon: string; title: string; text: string };

/** The four "Vì sao chọn Tâm Trí" items. Only commitments the center really keeps. */
export function WhyForm({ items }: { items: Why[] }) {
  return (
    <AdminForm action={saveWhyChooseUs} cancelHref="/admin/banner/vi-sao-chon" submitLabel="Lưu">
      <p className="rounded-xl bg-sun-50 px-4 py-3 text-[14px] text-body ring-1 ring-sun-100 ring-inset">Chỉ ghi những cam kết trung tâm thực sự làm. Không thêm “giữ giá”, “miễn phí”… khi chưa được xác nhận.</p>
      {[0, 1, 2, 3].map((index) => (
        <Section key={index} title={`Mục ${index + 1}`}>
          <Select label="Biểu tượng" name={`icon${index}`} defaultValue={items[index]?.icon ?? "shield"}>
            {Object.keys(brandIcons).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
          <TextInput label="Tiêu đề" name={`title${index}`} defaultValue={items[index]?.title} required maxLength={60} />
          <TextArea label="Mô tả" name={`text${index}`} defaultValue={items[index]?.text} required rows={2} maxLength={200} />
        </Section>
      ))}
    </AdminForm>
  );
}

export function FaqForm({ faq }: { faq?: Faq }) {
  return (
    <AdminForm action={saveFaq} cancelHref="/admin/banner/cau-hoi" submitLabel={faq ? "Lưu thay đổi" : "Thêm câu hỏi"}>
      <input type="hidden" name="id" value={faq?.id ?? ""} />
      <Section title="Câu hỏi">
        <TextInput label="Câu hỏi" name="question" defaultValue={faq?.question} required maxLength={300} />
        <TextArea label="Trả lời" name="answer" defaultValue={faq?.answer} required rows={5} maxLength={3000} />
        <Check name="showOnHome" label="Hiện ở trang chủ" hint="Trang chủ chỉ hiện 3 câu đầu trong số các câu được bật." defaultChecked={faq?.showOnHome ?? false} />
        <Check name="isVisible" label="Hiện trên website" defaultChecked={faq?.isVisible ?? true} />
      </Section>
    </AdminForm>
  );
}
