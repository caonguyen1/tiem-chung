import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, SeoFields, TextArea, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import type { schema } from "@/db";
import { saveArticle } from "@/lib/actions/admin/articles";
import { dateInput } from "@/lib/admin/form";

type Article = typeof schema.articles.$inferSelect;

/** Create / edit form of an article, promotion or outbreak alert. */
export function ArticleForm({
  article,
  categories,
  doctors,
}: {
  article?: Article;
  categories: { id: number; name: string; isPromotion: boolean }[];
  doctors: { id: number; title: string; name: string }[];
}) {
  const published = dateInput(article?.publishedAt ?? new Date());
  return (
    <AdminForm action={saveArticle} cancelHref="/admin/bai-viet" submitLabel={article ? "Lưu thay đổi" : "Thêm bài viết"}>
      <input type="hidden" name="id" value={article?.id ?? ""} />
      <Section title="Nội dung">
        <TextInput label="Tiêu đề" name="title" defaultValue={article?.title} required maxLength={200} />
        <div className="grid gap-4 tab:grid-cols-2">
          <Select label="Chuyên mục" name="categoryId" defaultValue={article?.categoryId ?? ""} required hint="Chọn “Khuyến mãi” để bài hiện ở trang Khuyến mãi.">
            <option value="" disabled>
              Chọn chuyên mục
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isPromotion ? " (khuyến mãi)" : ""}
              </option>
            ))}
          </Select>
          <TextInput label="Ngày đăng" name="publishedAt" type="date" defaultValue={published} />
        </div>
        <TextArea label="Mô tả ngắn" name="excerpt" defaultValue={article?.excerpt} required rows={3} maxLength={500} hint="Hiện ở danh sách bài và khi chia sẻ." />
        <ImageField name="image" label="Ảnh đại diện" ratio={[16, 10]} width={1200} value={article?.image} />
        <TextArea
          label="Nội dung bài"
          name="body"
          defaultValue={article?.body}
          rows={18}
          hint={'Cách viết: dòng trống = đoạn mới; "## Tiêu đề" = tiêu đề phụ; dòng bắt đầu bằng "- " = gạch đầu dòng.'}
        />
        <TextInput label="Đường dẫn (slug)" name="slug" defaultValue={article?.slug} maxLength={80} hint="Để trống thì tự tạo từ tiêu đề." />
      </Section>

      <Section title="Kiểm duyệt và nổi bật">
        <Select label="Bác sĩ kiểm duyệt" name="reviewerId" defaultValue={article?.reviewerId ?? ""} hint="Hiện dòng “Bác sĩ kiểm duyệt” trên bài.">
          <option value="">Không có</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.title} {doctor.name}
            </option>
          ))}
        </Select>
        <Check name="isFeatured" label="Bài nổi bật" hint="Được xếp lên đầu danh sách bài viết." defaultChecked={article?.isFeatured} />
      </Section>

      <Section title="Cảnh báo dịch bệnh" description="Bật để bài này hiện trong khối “Cảnh báo dịch” ở trang chủ.">
        <Check name="isOutbreakAlert" label="Hiện làm cảnh báo dịch bệnh" defaultChecked={article?.isOutbreakAlert} />
        <div className="grid gap-4 tab:grid-cols-2">
          <Select label="Mức độ" name="alertLevel" defaultValue={article?.alertLevel ?? "watch"}>
            <option value="high">Đang vào mùa / cao điểm</option>
            <option value="watch">Cần theo dõi</option>
          </Select>
          <TextInput label="Nhãn trên thẻ" name="alertTag" defaultValue={article?.alertTag ?? ""} maxLength={60} hint="Ví dụ: Đang vào mùa." />
        </div>
        <TextInput label="Tiêu đề ngắn trên thẻ" name="alertTitle" defaultValue={article?.alertTitle ?? ""} maxLength={160} hint="Để trống thì dùng tiêu đề bài." />
        <TextInput label="Dòng mô tả dưới tiêu đề" name="alertTeaser" defaultValue={article?.alertTeaser ?? ""} maxLength={200} />
      </Section>

      <Section title="Hiển thị">
        <Check name="isVisible" label="Hiện trên website" defaultChecked={article?.isVisible ?? true} />
      </Section>
      <SeoFields title={article?.seoTitle} description={article?.seoDescription} />
    </AdminForm>
  );
}
