# Bàn giao: việc còn chờ khách xác nhận

Cập nhật 2026-11-13, khi hoàn tất phase 8f. Cách đưa lên server: xem `deployment.md`.

## Nội dung / dữ liệu cần khách cung cấp

- [ ] Ảnh thật của tòa nhà / trung tâm (đang dùng phối cảnh).
- [ ] Số hotline riêng từng cơ sở và tổng đài chính (nhập ở Admin → Menu & thông tin chung → Tổng đài).
- [ ] Link mạng xã hội, đặc biệt Zalo (nút "Chat với bác sĩ" chỉ hiện khi có link Zalo).
- [ ] Bảng giá thật của vắc xin và gói (giá hiện tại là dữ liệu mẫu).
- [ ] Bác sĩ kiểm duyệt toàn bộ nội dung y khoa mẫu: mục chi tiết vắc xin, câu hỏi thường gặp, thành phần gói, tiểu sử bác sĩ, bài viết, trang chính sách, trang giới thiệu.
- [ ] Ảnh và thông tin thật của đội ngũ bác sĩ.
- [ ] Các cam kết dịch vụ được phép công bố (chỉ ghi những gì trung tâm thật sự làm).
- [ ] Tên miền chính thức và nơi đặt server.

## Việc kỹ thuật khi lên server

- [ ] Đổi mật khẩu admin mẫu; tạo tài khoản cho từng nhân viên.
- [ ] Đặt `SITE_URL`, `UPLOAD_DIR` (ổ giữ lâu dài), mật khẩu database mạnh.
- [ ] nginx gửi `X-Forwarded-For`.
- [ ] Đặt `SITE_INDEXABLE=1` khi chính thức ra mắt.
- [ ] Lên lịch sao lưu database và thư mục ảnh.

## Đã hoàn thành

Website 20 trang, admin 13 module, đặt lịch / tư vấn lưu vào database, xuất Excel, phân quyền admin/biên tập viên, chống spam, header bảo mật, không tràn ngang trên mobile (website và admin ở 375px).
