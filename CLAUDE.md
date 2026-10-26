# Website Tiêm chủng Tâm Trí

Website và admin cho Trung tâm Tiêm chủng Tâm Trí (Quy Nhơn, Gia Lai).

## Đọc trước khi làm

- Spec page & chức năng (20 page frontend, 13 module admin): `docs/requirements/website-pages-and-features.pdf`
- Hồ sơ công ty, thương hiệu, USP, các điểm còn cần khách xác nhận: `docs/company/README.md`
- File gốc khách gửi (logo, sổ tiêm chủng, phối cảnh, danh mục vắc xin): `docs/company/source/`

## Stack & lệnh

- Next.js 16 (App Router) + Tailwind CSS v4 + `lucide-react`, quản lý gói bằng pnpm. Đọc `AGENTS.md` trước khi dùng API Next.js.
- `pnpm dev --port 3210` để chạy dev, `pnpm lint` để kiểm tra, `pnpm build` để build production.
- `pnpm export:layout [/duong-dan ...]` xuất ảnh toàn trang để gửi khách duyệt. Mặc định xuất trang chủ, dev server phải đang chạy. Ảnh ra nằm ở `docs/layouts/<trang>-desktop.jpg` (rộng 1440); thêm cờ `--mobile` nếu cần cả `<trang>-mobile.jpg` (rộng 390, độ phân giải 2x). Script nằm ở `scripts/export-layout.mjs`, dùng puppeteer-core với Chrome đã cài trên máy, và ghép từng đoạn bằng sharp (Chrome không chụp nổi ảnh cao quá khoảng 16k px). Phần tử nổi (cố định trên màn hình) phải gắn `data-export-hide` để không bị in vào giữa ảnh.
- **Deploy bản cho khách xem:** `npx vercel@65.2.0 deploy --prod --yes`. Project Vercel tên `tiem-chung` (tài khoản nguyen03091989), link production là https://tiem-chung-lilac.vercel.app. Project đã liên kết sẵn qua thư mục `.vercel/` (không commit thư mục này). `.vercelignore` loại `docs/` và `scripts/` khỏi gói upload. Trang mặc định `noindex` và `robots.txt` chặn toàn bộ; chỉ đặt biến môi trường `SITE_INDEXABLE=1` trên Vercel khi ra mắt thật. Deploy là đưa lên mạng công khai, luôn hỏi người dùng trước.
- `DEMO_EXPORT=1 pnpm build` xuất bản tĩnh ra thư mục `out/` để gửi khách xem (chế độ này tắt PPR).
- Dữ liệu tạm nằm ở `src/content/*.ts`, có kiểu trong `src/content/types.ts`, và đã có hình dạng giống các module admin. Khi gắn CMS chỉ cần thay phần loader, không phải sửa component.
- Token màu nằm trong `src/app/globals.css` (`brand-*` là xanh, `sun-*` là vàng). Không hardcode mã hex trong component, trừ icon SVG.
- Icon lớn (nhóm bệnh, lối tắt, USP, đối tượng gói) nằm ở `src/components/icons/brand-icons.tsx`: nền tròn `brand-50`, nét xanh 2.5px và một mảng vàng. Icon mới phải theo đúng kiểu này. Icon nhỏ trong UI thì dùng `lucide-react`.
- Mọi link đều phải đi qua `AppLink` (`src/components/ui/app-link.tsx`). Link tới trang chưa làm hiển thị như bình thường nhưng không bấm được, và không có hiệu ứng hover. Khi làm xong một trang, thêm đường dẫn của trang đó vào `builtPaths` trong `src/lib/routes.ts`; hành động dạng `#hash` đã chạy được thì thêm vào `builtHashActions`. Link "Xem tất cả", mũi tên và hiệu ứng nổi của card chỉ hiện khi trang đích đã có.
- Banner trang chủ là ảnh hoàn chỉnh, mỗi banner có 2 bản: PC 1920×560 và mobile 1080×1080, khai báo trong `heroBanners` (`src/content/site.ts`). Banner mẫu được thiết kế bằng HTML trong `scripts/banners/NN-ten.html` (dùng chung `banner.css` và `icons.js`). Xuất ảnh bằng `bash scripts/banners/render.sh [ten]`, ảnh ra nằm trong `public/images/banners/`. Các chấm chuyển slide nằm ở góc trên bên phải trên mobile và giữa cạnh dưới trên PC, nên không đặt chi tiết quan trọng ở hai vùng đó. Nút CTA vẽ sẵn trong ảnh đặt ở góc dưới bên trái. Banner cần nhiều nút bấm thật (ví dụ `gioi-thieu`) thì vẽ ảnh chừa trống góc dưới bên trái và khai báo `actions`; slider sẽ đặt nút HTML vào vị trí left 5.2% / bottom 5.5% (mobile) và left 9.9% / bottom 12% (PC). Sau khi render lại ảnh trùng tên, xóa `.next/dev/cache/images` (và `.next/cache/images`), nếu không trình tối ưu ảnh của Next vẫn trả ảnh cũ.
- Trang chủ sắp xếp theo góp ý của khách ngày 2026-10-26, ưu tiên giao diện mobile: Banner → Lối tắt (Tra cứu, Gói, Đặt lịch, Tư vấn) + cảnh báo dịch → Tra cứu vắc xin theo bệnh (có ô tìm kiếm) → Gói vắc xin → Vì sao chọn Tâm Trí (dải 4 ô) → Gợi ý vắc xin → Kiến thức (4 bài) → FAQ + Liên hệ. Không đưa khối bác sĩ lên trang chủ. Trên mobile, danh sách thẻ (vắc xin, gói, bài viết) vuốt ngang, và mô tả dưới tiêu đề section bị ẩn.
- Đặt lịch và tư vấn là popup mở bằng hash: `#dat-lich` (hoặc `#dat-lich=<slug>` để chọn sẵn vắc xin/gói, dùng `bookingHref()`) và `#tu-van`, xây trên `HashDialog` (`src/components/forms/`). Mọi nút "Đặt lịch/Đặt hẹn" dùng hai hash này cho tới khi có trang `/dat-hen`. Chỉ ghi các cam kết mà trung tâm thực sự làm (khách yêu cầu); không thêm "giữ giá", "miễn phí"... khi chưa được xác nhận.
- Cảnh báo dịch là danh sách `outbreakAlerts`, hiển thị bằng `OutbreakTicker`, tự chuyển tin mỗi 5 giây. Danh sách rỗng thì ẩn cả dải.
- Ảnh web được cắt từ file của khách bằng `python scripts/prep-brand-assets.py <repo>`.

## Quy tắc

- VNVC, Long Châu chỉ là tham khảo **chức năng**. Không sao chép UI/UX, bố cục hay màu sắc của họ.
- Màu thương hiệu: xanh `#283C96`, vàng `#FADC00`. Slogan: "Tận tâm đồng hành cùng bạn".
- Font web: Google Sans Flex.
- Thông tin liên hệ, địa chỉ, tổng đài, giờ mở cửa, bác sĩ là dữ liệu do admin quản lý. Không hardcode vào code; dùng dữ liệu tạm có sẵn trong `docs/company/README.md`.
- Toàn bộ nội dung hiển thị viết bằng tiếng Việt.
