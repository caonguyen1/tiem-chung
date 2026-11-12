"use client";

import { useState } from "react";

import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, TextInput } from "@/components/admin/admin-fields";
import { ImageField } from "@/components/admin/image-field";
import type { schema } from "@/db";
import { saveBanner } from "@/lib/actions/admin/banners";
import { dateInput } from "@/lib/admin/form";

type Banner = typeof schema.banners.$inferSelect;
type Placement = Banner["placement"];

// Shapes the public pages draw each banner in (see HeroBanner, OfferBanner, WelcomePopup).
const shapes: Record<Placement, { desktop: [number, number]; mobile: [number, number] | null; width: [number, number]; help: string }> = {
  hero: { desktop: [800, 420], mobile: [343, 440], width: [1600, 1029], help: "Banner chính (slider đầu trang chủ). Mỗi banner cần ảnh riêng cho máy tính và điện thoại, bản điện thoại phải có đủ nội dung như bản máy tính." },
  promo: { desktop: [3, 1], mobile: [9, 5], width: [2400, 1080], help: "Banner ưu đãi nằm ngang giữa trang chủ, cả ảnh là một đường link." },
  popup: { desktop: [1, 1], mobile: null, width: [1080, 1080], help: "Popup tự mở khi khách vào trang, một ảnh vuông dùng chung mọi màn hình." },
};

/** Create / edit form of a banner; the image shapes follow the chosen position. */
export function BannerForm({ banner }: { banner?: Banner }) {
  const [placement, setPlacement] = useState<Placement>(banner?.placement ?? "hero");
  const shape = shapes[placement];
  return (
    <AdminForm action={saveBanner} cancelHref="/admin/banner" submitLabel={banner ? "Lưu thay đổi" : "Thêm banner"}>
      <input type="hidden" name="id" value={banner?.id ?? ""} />
      <Section title="Vị trí" description={shape.help}>
        <Select label="Hiển thị ở" name="placement" value={placement} onChange={(event) => setPlacement(event.target.value as Placement)}>
          <option value="hero">Banner chính (slider)</option>
          <option value="promo">Banner ưu đãi</option>
          <option value="popup">Popup chào mừng</option>
        </Select>
        <TextInput label="Tên banner (để nhận biết trong danh sách)" name="name" defaultValue={banner?.name} required maxLength={120} />
      </Section>

      <Section title="Hình ảnh" description="Ảnh được cắt đúng tỉ lệ ngay khi chọn.">
        <div className="grid gap-5 tab:grid-cols-2">
          <ImageField key={`${placement}-d`} name="imageDesktop" label={shape.mobile ? "Ảnh máy tính" : "Ảnh popup"} ratio={shape.desktop} width={shape.width[0]} value={banner?.imageDesktop} />
          {shape.mobile && <ImageField key={`${placement}-m`} name="imageMobile" label="Ảnh điện thoại" ratio={shape.mobile} width={shape.width[1]} value={banner?.imageMobile} />}
        </div>
        <TextInput label="Mô tả ảnh (alt)" name="alt" defaultValue={banner?.alt} required maxLength={300} hint="Đọc cho người dùng màn hình đọc và công cụ tìm kiếm; nên ghi lại chữ chính trên banner." />
      </Section>

      <Section title="Liên kết">
        <TextInput label="Link khi bấm vào banner" name="href" defaultValue={banner?.href} maxLength={400} hint="Ví dụ: /goi-vac-xin hoặc #dat-lich (mở popup đặt lịch). Để trống nếu không cần." />
        {placement === "hero" && (
          <>
            <p className="text-sm font-bold text-brand-800">Nút đặt trên ảnh (tùy chọn, tối đa 2)</p>
            <p className="-mt-2 text-[13px] text-subtle">Chỉ dùng cho ảnh để trống góc dưới bên trái. Ảnh đã vẽ sẵn nút thì bỏ trống phần này.</p>
            {[0, 1].map((index) => (
              <div key={index} className="grid gap-3 tab:grid-cols-2">
                <TextInput label={`Nút ${index + 1}: chữ`} name={`actionLabel${index}`} defaultValue={banner?.actions[index]?.label ?? ""} maxLength={40} />
                <TextInput label={`Nút ${index + 1}: link`} name={`actionHref${index}`} defaultValue={banner?.actions[index]?.href ?? ""} maxLength={400} />
              </div>
            ))}
          </>
        )}
      </Section>

      <Section title="Lịch hiển thị" description="Để trống nếu hiện liên tục.">
        <div className="grid gap-4 tab:grid-cols-2">
          <TextInput label="Bắt đầu từ ngày" name="startsAt" type="date" defaultValue={dateInput(banner?.startsAt)} />
          <TextInput label="Kết thúc vào ngày" name="endsAt" type="date" defaultValue={dateInput(banner?.endsAt)} />
        </div>
        <Check name="isVisible" label="Hiện trên website" defaultChecked={banner?.isVisible ?? true} />
      </Section>
    </AdminForm>
  );
}
