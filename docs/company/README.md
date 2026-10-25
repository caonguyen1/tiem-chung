# Trung tâm Tiêm chủng Tâm Trí — Hồ sơ công ty & thương hiệu

Cập nhật: 2026-10-23. Tổng hợp từ bộ tài liệu khách gửi (file gốc nằm trong `source/`).

## Thông tin chung

| Mục | Giá trị |
|---|---|
| Tên | Trung tâm Tiêm chủng Tâm Trí — *Tam Tri Vaccination Center* |
| Thuộc | Hệ thống Y tế Tâm Trí (cùng mặt bằng: Nhà thuốc Tâm Trí, Tâm Trí Kids, phòng khám) |
| Slogan | **Tận tâm đồng hành cùng bạn** |
| Thông điệp chính | Chủ động phòng bệnh — An tâm cho cả nhà · Chăm sóc trọn vẹn trước – trong – sau tiêm |
| Địa chỉ | 424 Nguyễn Thị Minh Khai, P. Quy Nhơn Nam, T. Gia Lai |
| SĐT Google Maps | 0593 888 666 |
| Tổng đài | \*3979 — 0: góp ý chất lượng · 1: tư vấn & đặt lịch · 2: BS Sản phụ khoa · 3: BS Nhi khoa |
| Website (in trên sổ) | tamtrihealthcare.vn |
| Khai trương | 08.11.2026 |
| Người đại diện chuyên môn | BSCKII. Đỗ Văn Tâm — Giám đốc Hệ thống Y tế Tâm Trí |

Hiện chỉ có **1 trung tâm**. Module "Hệ thống trung tâm" vẫn làm đủ theo spec để mở rộng sau.

Các thông tin liên hệ trên chỉ là dữ liệu tạm. Địa chỉ, tổng đài, email, giờ hoạt động, mạng xã
hội và bác sĩ sẽ do khách cập nhật trong admin, nên **không hardcode vào code**. Mọi chỗ hiển thị
đều đọc từ module "Menu & thông tin chung" hoặc "Trung tâm".

## Nhận diện thương hiệu

- **Màu chính**
  - Xanh Tâm Trí `#283C96` (RGB 40, 60, 150): chữ, tiêu đề, nền khối đậm
  - Vàng Tâm Trí `#FADC00` (RGB 250, 220, 0): tên thương hiệu, điểm nhấn
- **Font web:** **Google Sans Flex** (Google Fonts), dùng cho toàn bộ website và admin.
- **Font logo:** SVN-Aptima Bold / Regular chỉ có trong file logo, không dùng trên web.
- **Logo:** dáng người mẹ mang thai trong vòng tròn mở, nét xanh và vàng. Có bản dọc (kèm
  "TRUNG TÂM TIÊM CHỦNG") và bản đơn (logo + "TÂM TRÍ" + slogan). Hệ lưới 240px nằm ở
  `source/[TamTri] LOGO_Thong-so.jpg`.
- **Phong cách ấn phẩm hiện có:** nền trắng/xanh trời nhạt, tiêu đề xanh đậm in hoa, vàng/ánh kim làm
  điểm nhấn, ảnh thật gia đình – bác sĩ, icon line trong vòng tròn.
- **Không gian thực tế (phối cảnh):** trắng + xanh dương đậm + sọc vàng chạy ngang, sàn gỗ, ghế
  xanh có viền vàng. Web nên lặp lại motif "sọc xanh–vàng" này để thống nhất online/offline.

## Định vị & USP (từ sổ tiêm chủng)

Đối tượng trọng tâm là **mẹ & bé**: chuẩn bị mang thai → thai kỳ → những năm đầu đời. Mở rộng ra
cả gia đình, người lớn và người có bệnh mạn tính.

- 100% khách được bác sĩ khám sàng lọc trước tiêm
- Vắc xin nguồn gốc rõ ràng, chuỗi lạnh kiểm soát chặt
- Theo dõi sau tiêm 30 phút
- Nhắc lịch tiêm qua Zalo
- Tư vấn lịch & phác đồ cá nhân hoá; có BS Sản phụ khoa và BS Nhi khoa
- Không gian hiện đại, sạch, thân thiện với trẻ nhỏ và mẹ bầu

## Nội dung tái sử dụng cho web

- `source/DANH MỤC TỔNG HỢP VẮC XIN.docx`: 27 nhóm vắc xin, kèm tên biệt dược và bệnh phòng
  ngừa. Đây là seed data cho danh mục, nhóm bệnh và bộ lọc.
- `source/SO TIEM CHUNG - TAM TRI.pdf` (36 trang): bài "Vì sao chọn Tâm Trí", "Khám sàng lọc
  trước tiêm", "Phản ứng thường gặp", bảng lịch tiêm, bảng chiều cao – cân nặng chuẩn. Dùng làm
  bài viết Kiến thức, nội dung trang Giới thiệu và các mục chi tiết vắc xin.
- `source/COVER_TTTC TÂM TRÍ.jpg`, `source/AVT_TTTC TÂM TRÍ.png`: banner/ảnh đại diện mạng xã hội.
  Hướng hero tham khảo.
- `source/PHỐI CẢNH_...pdf` (15 trang): ảnh phối cảnh mặt tiền và nội thất. Dùng tạm cho trang Giới
  thiệu và Chi tiết trung tâm khi chưa có ảnh chụp thật.

## Nguyên tắc thiết kế

- VNVC, Long Châu… **chỉ dùng tham khảo chức năng**. Không sao chép bố cục, UI/UX hay màu sắc.
  Đây là sản phẩm cạnh tranh, phải có nhận diện riêng.
- Mọi màu và font lấy từ token thương hiệu ở trên. Không tự thêm màu chủ đạo mới.
