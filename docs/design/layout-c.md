# Layout C — hệ giao diện đã được khách duyệt

Cập nhật: 2026-11-01. Khách đã duyệt bố cục trang chủ theo phương án C. Mọi trang trong (danh mục vắc xin, chi tiết vắc xin, gói vắc xin, bài viết, giới thiệu...) phải dùng lại đúng hệ này: màu, font, khoảng cách, kiểu thẻ, kiểu banner.

- Bản xem trước: `public/prototypes/layout-c.html`, xem online tại https://tiem-chung-lilac.vercel.app/prototypes/layout-c.html
- Ảnh banner/popup mẫu: `public/prototypes/art/`, thiết kế gốc bằng HTML trong `scripts/prototype-art/`, xuất ảnh bằng `bash scripts/prototype-art/render.sh`
- Font: `public/fonts/svn-aptima-regular.ttf`, `public/fonts/svn-aptima-bold.ttf` (khách gửi ngày 2026-11-01)

> Bản xem trước là HTML tĩnh. Khi đưa vào Next.js, các giá trị dưới đây chuyển thành token trong `src/app/globals.css` và component trong `src/components/`, không chép nguyên CSS.

## 1. Thương hiệu

**Màu.** Chỉ dùng xanh `#283C96`, vàng `#FADC00` và các sắc đậm nhạt của chúng. Không dùng các tông xanh lệch màu khác (khách yêu cầu "tuân thủ tuyệt đối").

| Vai trò | Mã | Ghi chú |
|---|---|---|
| Xanh chính (`--navy`) | `#283C96` | nút chính, tiêu đề nhấn |
| Xanh đậm (`--ink`) | `#1C2A66` | chữ tiêu đề, footer, điểm đầu gradient |
| Xanh sáng (`--blue`) | `#324CBD` | link "Xem tất cả", chữ số nhấn |
| Xanh sáng hơn (`--bright`) | `#4A62CF` | điểm cuối gradient, nắp lọ vắc xin |
| Vàng (`--sun`) | `#FADC00` | nhãn, sticker, viền thẻ "Phổ biến nhất", gạch dưới |
| Nền trang (`--page`) | `#EEF3FF` | |
| Viền (`--line`) | `#E2E8F6` | |
| Chữ thường / chữ phụ | `#4A5277` / `#7A819E` | |
| Cảnh báo | `#F04E23` | chỉ dùng cho cảnh báo dịch và nhãn giảm giá |

**Gradient cho khối xanh** (header, ô lối tắt, khối Gói vắc xin, khối gợi ý, thẻ liên hệ, thẻ cảnh báo): đi từ `#1C2A66` qua `#283C96` tới `#4A62CF`, góc khoảng 100–150°. Khối xanh không được trông như một màu phẳng.

**Hoa văn.** Khối xanh chỉ có một lớp lưới chấm trắng mờ (`.tex`). Khách đã yêu cầu bỏ:
- đường cong trang trí (đặc biệt đường cong vàng),
- tia sáng, quầng sáng, vệt sáng ("hiệu ứng ánh sáng").

**Font.** SVN-Aptima cho toàn bộ chữ (bản thường 400 và bản đậm 700; chỗ nào cần chữ đậm hơn cũng dùng 700). Google Sans Flex chỉ là font dự phòng. Font Aptima chỉ có 2 độ đậm, nên đừng thiết kế dựa vào 800/900.

**Bo góc.** Khung lớn (banner, box section) 10px; thẻ 10–12px; nút 8px; nhãn/nút trong ảnh banner bo tròn hẳn.

## 2. Khung và khoảng cách

- Khung nội dung tối đa 1232px (1200px + lề 16px mỗi bên).
- Breakpoint: desktop > 900px, máy tính bảng 601–900px, điện thoại ≤ 600px.

| | Desktop | Máy tính bảng | Điện thoại |
|---|---|---|---|
| Khoảng cách giữa 2 section | 64px (mỗi section `padding: 32px 0`) | 48px | 32px (`--space`) |
| Khoảng cách giữa các khối trong cùng section | 16–28px | 12–20px | 12px (`--gap`) |
| Tiêu đề section → nội dung | 28px | | 12px |
| Lề hai bên | 16px | 20px | 16px |

Khách đã phàn nàn khoảng trống 128px giữa các section là quá rộng; giữ đúng 64px trên desktop. Trên điện thoại, mọi section cách đều nhau, không section nào tự đặt khoảng cách riêng.

Khối có nền khác màu nền trang (khối Gói vắc xin xanh, khối vắc xin nền trắng trên mobile) tự có padding trong và nối với khối kế bên bằng đường cong (wave) cùng màu. Dưới đường cong phải chừa đủ khoảng trống (desktop 136px, mobile 76px) để không dính vào nút "Xem tất cả".

## 3. Thành phần dùng chung

- **Tiêu đề section:** chữ 32px (mobile 20px), bên trái có vạch dọc nửa vàng nửa xanh, bên phải là link "Xem tất cả ›". Mô tả dưới tiêu đề bị ẩn trên mobile.
- **Nút:** cao 46px (nhỏ: 40px), nền xanh chính hoặc nền trắng. Nút viền dùng nền trắng + viền `#C9D4F3`.
- **Thẻ vắc xin:** ảnh 16:9, lọ vắc xin cao 88% khung ảnh, nhãn xuất xứ góc trên trái; dưới là tên, mô tả 2 dòng, giá + nút Đặt lịch.
- **Thẻ gói vắc xin:** icon + độ tuổi + tên; 2 ô số liệu (mũi tiêm, loại vắc xin); giá, giá gốc gạch ngang, nhãn giảm %; hai nút Chi tiết / Đặt lịch luôn nằm sát đáy thẻ. Gói nổi bật có viền vàng 3px và nhãn "Phổ biến nhất".
- **Thẻ bài viết:** ảnh 16:10, nhãn chuyên mục trên ảnh, ngày, tiêu đề.
- **Ảnh thẻ liên hệ:** 12:5.
- **Tỉ lệ ảnh không đổi giữa desktop và mobile.** Dùng `aspect-ratio`, không đặt chiều cao cố định theo từng breakpoint.
- **Icon lớn** theo kiểu `brand-icons` (nền tròn nhạt, nét xanh, một mảng vàng). Icon nhỏ dùng lucide.

## 4. Quy tắc riêng cho điện thoại

- Danh sách thẻ (vắc xin, gói, bài viết, nhóm bệnh) vuốt ngang, tràn sát mép màn hình, mỗi thẻ rộng khoảng 74% (tối đa 280px) để lộ một phần thẻ kế tiếp.
- Lối tắt: 3 ô trên một hàng (Tra cứu vắc xin, Đặt lịch tiêm, Tư vấn). Khách đã bỏ ô "Gói vắc xin".
- Cảnh báo dịch: một dòng chữ chạy (marquee), có nhãn "Cảnh báo dịch" cố định bên trái. Desktop vẫn là thẻ.
- Section "Vắc xin theo bệnh" nền trắng.
- Chữ trong thẻ không nhỏ hơn 11px.

## 5. Banner và popup là ảnh

Khách muốn banner là **ảnh hoàn chỉnh**, admin tải lên và thay được, không dựng bằng HTML. Mỗi banner có **2 ảnh: một cho desktop, một cho mobile**.

**Bản mobile phải có đầy đủ thông tin và hình ảnh như bản desktop** (chữ, nhãn, ảnh, lọ vắc xin, sticker...). Không được cắt bớt nội dung cho gọn; nếu không đủ chỗ thì đổi bố cục (xếp dọc, ảnh xuống dưới) và cho ảnh mobile cao hơn.

| Ảnh | Desktop | Mobile | Ghi chú |
|---|---|---|---|
| Banner chính (slider) | 1600×840 (khung 800×420) | 1029×1320 (khung 343×440) | Nút và chấm chuyển slide là HTML đặt lên ảnh |
| Banner ưu đãi phụ | 2400×800 (3:1) | 1080×1320 (khung 360×440) | Cả ảnh là một link |
| Popup chào mừng/quảng cáo | 1080×1080 | dùng chung | Tự mở khi vào trang, có nút đóng, Esc, bấm ra ngoài để đóng |

Banner cần nút bấm thật (ví dụ "Đặt lịch tiêm" + "Tra cứu vắc xin") thì ảnh **chừa trống** chỗ đặt nút, nút là HTML:
- Desktop: nút ở góc dưới bên trái (left 5.5%, bottom 7.2%), chấm chuyển slide ở góc dưới bên phải.
- Mobile: nút ở đáy (cách lề 16px), chấm chuyển slide ở góc trên bên phải. Không đặt chi tiết quan trọng ở hai vùng này.

Trang trong (danh mục, gói, bài viết...) nếu có banner đầu trang cũng theo đúng quy tắc trên.

Cách làm ảnh mẫu: vẽ bằng HTML trong `scripts/prototype-art/` (dùng `art.css`, font Aptima, ảnh từ `public/images/`), mỗi file đọc `?v=pc` hoặc `?v=mb` để đổi bố cục, rồi thêm một dòng `shot` vào `render.sh`. Desktop xuất 2x, mobile 3x.

## 6. Điều hướng đã chốt

- "Tra cứu vắc xin" (banner, lối tắt): cuộn tới section "Vắc xin theo bệnh" trên trang chủ (`#tra-cuu-vac-xin`).
- "Tất cả vắc xin": sang trang Danh mục vắc xin `/vac-xin`.
- "Đặt lịch" / "Tư vấn": popup `#dat-lich`, `#tu-van` (xem `CLAUDE.md`).
- FAQ trên trang chủ chỉ hiện 3 câu, có link "Xem thêm câu hỏi".

## 7. Lịch sử góp ý của khách

- 2026-10-26: thứ tự section trang chủ, ưu tiên mobile (xem `docs/progress.md`).
- 2026-11-01 (file "các yêu cầu chỉnh sửa ở trang home"): tuân thủ màu thương hiệu, banner mobile giữ đủ chi tiết, bỏ hiệu ứng ánh sáng, cảnh báo dịch dạng chữ chạy, 3 lối tắt, FAQ 3 câu, popup quảng cáo, banner ưu đãi phụ, nới khoảng trống đường cong khối Gói vắc xin.
- 2026-11-01 (góp ý thêm): bỏ đường cong vàng ở mọi khối, khối xanh có gradient, section vắc xin nền trắng trên mobile, banner/popup làm thành ảnh theo mẫu khách gửi, dùng font SVN-Aptima, giảm khoảng trống giữa section, banner mobile đủ nội dung như desktop.

## 8. Còn chờ khách xác nhận

- Nội dung chữ trên banner ưu đãi ("Ưu đãi tháng 11", "tiết kiệm đến 8%") và popup ("Chính thức đón khách") là nội dung mẫu.
- Quyền dùng font SVN-Aptima trên web (file font được tải công khai từ website).
