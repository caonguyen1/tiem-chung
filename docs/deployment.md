# Hướng dẫn triển khai lên server của khách

Website + admin chạy cùng một ứng dụng Next.js 16 (Node) và một database Postgres 17. Không deploy lên Vercel (chỉ dùng demo HTML).

## 1. Yêu cầu server

- Linux (Ubuntu 22.04+), 2 vCPU, 2 GB RAM trở lên, ổ đĩa giữ lâu dài cho ảnh tải lên.
- Node.js 22 LTS, pnpm (`corepack enable`), Postgres 17 (cài trực tiếp hoặc dùng `docker-compose.yml`).
- Tên miền trỏ về server; nginx (hoặc Caddy) làm reverse proxy và cấp HTTPS (Let's Encrypt).

## 2. Biến môi trường (`.env` trên server, không commit)

| Biến | Giá trị |
|---|---|
| `DATABASE_URL` | `postgres://<user>:<mật khẩu mạnh>@<host>:5432/<db>` |
| `POSTGRES_*` | Chỉ cần nếu dùng `docker-compose.yml`; đặt mật khẩu mạnh, không dùng `tiem_chung_dev` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Tài khoản admin đầu tiên khi chạy `db:seed`. Đặt mật khẩu mạnh (≥ 10 ký tự), không dùng `change-me-please` |
| `SITE_URL` | Địa chỉ thật, ví dụ `https://tiemchungtamtri.vn` (dùng cho canonical, sitemap) |
| `SITE_INDEXABLE` | Để trống khi chạy thử; đặt `1` đúng lúc ra mắt để Google được index |
| `UPLOAD_DIR` | Thư mục ảnh tải lên, **phải nằm trên ổ giữ lâu dài** và có sao lưu (ví dụ `/var/lib/tamtri/uploads`) |

## 3. Cài đặt lần đầu

```bash
git clone <repo> && cd tiem-chung
pnpm install --frozen-lockfile
cp .env.example .env        # rồi sửa các giá trị ở mục 2
pnpm db:migrate             # tạo bảng
pnpm db:seed                # CHỈ chạy lần đầu: nhập dữ liệu mẫu + tài khoản admin (xóa sạch dữ liệu cũ!)
pnpm build                  # cần database đang chạy
pnpm start -p 3210          # nên chạy bằng systemd hoặc pm2
```

Sau khi seed và đăng nhập, **đổi mật khẩu admin ngay** tại `/admin/mat-khau`, rồi tạo tài khoản riêng cho từng nhân viên ở `/admin/tai-khoan`.

> Cảnh báo: `db:seed` xóa sạch dữ liệu. Không chạy lại trên server đang có dữ liệu thật.

## 4. Reverse proxy (nginx)

- Chuyển tiếp tới `127.0.0.1:3210`.
- **Bắt buộc** gửi `X-Forwarded-For` (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) và `Host`, nếu không giới hạn gửi form chống spam coi mọi khách là một người.
- `client_max_body_size 6m;` (ảnh tải lên tối đa 4 MB).
- Bật HTTPS và chuyển hướng HTTP sang HTTPS.
- Giới hạn tốc độ nhớ trong bộ nhớ của một tiến trình: chỉ chạy **một** tiến trình Node (không cluster) hoặc chấp nhận giới hạn lỏng hơn.

## 5. Cập nhật phiên bản

```bash
git pull && pnpm install --frozen-lockfile
pnpm db:migrate      # áp dụng migration mới (nếu có)
pnpm build && systemctl restart tamtri
```

Không chạy `db:seed` khi cập nhật.

## 6. Sao lưu

- Database: `pg_dump` hằng đêm, giữ ít nhất 14 ngày.
- Thư mục `UPLOAD_DIR`: sao lưu cùng lúc (mất thư mục này là mất ảnh bác sĩ, bài viết, trung tâm, banner).
- Có thể xuất danh sách lịch hẹn / tư vấn ra Excel từ admin bất cứ lúc nào.

## 7. Kiểm tra sau khi lên

- [ ] `/` mở được, HTTPS hợp lệ, ảnh hiển thị.
- [ ] Đăng nhập `/admin/dang-nhap`, đổi mật khẩu, tạo tài khoản nhân viên.
- [ ] Gửi thử một lịch hẹn và một yêu cầu tư vấn từ website; thấy trong admin; xóa bản thử.
- [ ] Sửa một vắc xin trong admin, trang công khai đổi ngay.
- [ ] Tải thử một ảnh trong admin, khởi động lại server, ảnh vẫn còn.
- [ ] `/sitemap.xml` đúng tên miền; `robots.txt` đúng chế độ (chặn khi chưa ra mắt).
- [ ] Đặt `SITE_INDEXABLE=1`, build lại, khi chính thức ra mắt.

## 8. Bảo mật đã có sẵn

- Mật khẩu băm scrypt; phiên 7 ngày lưu SHA-256 của token; khóa tạm khi đăng nhập sai quá 5 lần / 15 phút.
- Mọi trang và action admin kiểm tra quyền; `/admin` không cache, không index.
- Header: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Form đặt lịch / tư vấn: ô bẫy bot (honeypot) + tối đa 5 lần gửi / 10 phút / địa chỉ.
- Ảnh tải lên kiểm tra loại bằng byte đầu, tối đa 4 MB; Excel xuất chống công thức độc.
