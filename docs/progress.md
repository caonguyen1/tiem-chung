# Tiến độ — Website Tiêm chủng Tâm Trí

Cập nhật: 2026-10-23. Tạm dừng theo yêu cầu, chưa commit gì vào git.

## Đã xong

- Khung Next.js 16 + Tailwind v4 + pnpm (xem `CLAUDE.md` để biết lệnh chạy và quy tắc).
- Hồ sơ thương hiệu: `docs/company/README.md`. File gốc của khách nằm trong `docs/company/source/`.
- **Trang chủ** (`src/app/page.tsx`) gồm:
  - Banner dạng ảnh hoàn chỉnh: 4 banner, mỗi banner có bản PC 1920×560 và mobile 1080×1080, nằm trong `public/images/banners/`. Thiết kế gốc bằng HTML ở `scripts/banners/`.
  - Dải cảnh báo dịch có nhiều tin, tự chuyển mỗi 5 giây.
  - 5 lối tắt, 4 cam kết, tab vắc xin theo bệnh, gói vắc xin, khối "Tôi nên tiêm gì", đội ngũ bác sĩ, kiến thức, danh mục nổi bật, hệ thống trung tâm, footer, nút liên hệ nổi, popup tư vấn.
- Link tới trang chưa làm hiển thị nhưng không bấm được: dùng `AppLink`, danh sách trang đã có nằm trong `src/lib/routes.ts`.
- Phần banner và dải cảnh báo đã qua lint và type-check, đã kiểm tra ở PC 1280/1680 và mobile 375.

## Việc tiếp theo khi quay lại

1. ~~Lint, build, xuất lại `out/`~~: đã xong ngày 2026-10-25, `out/` đã có banner mới và dải cảnh báo. Lưu ý: trước khi build phải tắt dev server, vì build ghi đè thư mục `.next` mà dev server đang dùng.
2. ~~Commit~~: trang chủ đã commit `1af9897` trên nhánh `main` ngày 2026-10-25.
3. ~~Deploy cho khách xem~~: đã deploy ngày 2026-10-25 tại https://tiem-chung-lilac.vercel.app (noindex). Ảnh layout trang chủ: `docs/layouts/home-desktop.jpg`.
4. Làm các trang tiếp theo theo spec `docs/requirements/website-pages-and-features.pdf`. Làm xong trang nào thì thêm đường dẫn của trang đó vào `builtPaths`.

## Lưu ý

- Giá, giờ mở cửa, email, nội dung cảnh báo và 3 bác sĩ (ngoài BSCKII. Đỗ Văn Tâm) đều là dữ liệu mẫu.
- Dev server chạy ở cổng 3210, vì cổng 3100 đã bị chiếm.
- Trình duyệt trong app không chạy được `preview_start` theo tên cho repo này. Hãy bật dev server bằng lệnh nền, sau đó mở bằng URL.
