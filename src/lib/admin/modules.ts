/*
 * The 13 admin modules of docs/requirements/website-pages-and-features.pdf, in the order the
 * sidebar shows them (requests first, since staff open those every day). `phase` says when the
 * module's screens are built (docs: phase 8c content, 8d operations, 8e accounts).
 */

export type AdminIcon =
  | "syringe"
  | "tags"
  | "package"
  | "lightbulb"
  | "calendar"
  | "message"
  | "map"
  | "stethoscope"
  | "news"
  | "image"
  | "file"
  | "settings"
  | "users";

export type AdminModule = {
  slug: string;
  /** Number in the spec ("Module n"). */
  number: number;
  label: string;
  icon: AdminIcon;
  description: string;
  phase: "8c" | "8d" | "8e";
  /** Only these roles see and open it; everyone when omitted. */
  roles?: ("admin" | "editor")[];
};

export const adminModules: AdminModule[] = [
  { slug: "lich-hen", number: 5, label: "Lịch đặt hẹn", icon: "calendar", phase: "8d", description: "Danh sách đặt hẹn từ website: lọc theo trung tâm, ngày, trạng thái; cập nhật trạng thái; xuất Excel." },
  { slug: "tu-van", number: 6, label: "Yêu cầu tư vấn", icon: "message", phase: "8d", description: "Danh sách yêu cầu tư vấn: trạng thái xử lý, ghi chú nội bộ, xuất Excel." },
  { slug: "vac-xin", number: 1, label: "Vắc xin", icon: "syringe", phase: "8c", description: "Tên, ảnh, đơn vị, giá, nước và nhà sản xuất, độ tuổi, số liều, trạng thái; nội dung chi tiết theo từng mục, câu hỏi thường gặp, bác sĩ kiểm duyệt." },
  { slug: "danh-muc", number: 2, label: "Danh mục", icon: "tags", phase: "8c", description: "Nhóm bệnh (icon, banner), độ tuổi, nơi sản xuất dùng cho bộ lọc." },
  { slug: "goi-vac-xin", number: 3, label: "Gói vắc xin", icon: "package", phase: "8c", description: "Gói theo độ tuổi hoặc đối tượng: chọn vắc xin và số mũi, giá gói, ảnh minh họa." },
  { slug: "goi-y", number: 4, label: "Tôi nên tiêm gì", icon: "lightbulb", phase: "8c", description: "Cấu hình khoảng tuổi và giới tính ứng với vắc xin lẻ và gói gợi ý." },
  { slug: "trung-tam", number: 7, label: "Trung tâm tiêm chủng", icon: "map", phase: "8c", description: "Tên, địa chỉ mới và cũ, tỉnh và phường, tọa độ, giờ hoạt động." },
  { slug: "doi-ngu", number: 8, label: "Đội ngũ chuyên môn", icon: "stethoscope", phase: "8c", description: "Ảnh, học vị, tên, chuyên khoa, tiểu sử." },
  { slug: "bai-viet", number: 9, label: "Bài viết", icon: "news", phase: "8c", description: "Chuyên mục (gồm Khuyến mãi), bài viết, bài nổi bật, cảnh báo dịch bệnh, bác sĩ kiểm duyệt." },
  { slug: "banner", number: 10, label: "Banner & trang chủ", icon: "image", phase: "8c", description: "Banner slider (ảnh PC và mobile, link), banner ưu đãi, popup chào mừng và các khối trang chủ." },
  { slug: "chinh-sach", number: 11, label: "Trang chính sách", icon: "file", phase: "8c", description: "Nội dung các trang chính sách." },
  { slug: "cai-dat", number: 12, label: "Menu & thông tin chung", icon: "settings", phase: "8c", description: "Menu header và footer, tổng đài, mạng xã hội, thông tin công ty." },
  { slug: "tai-khoan", number: 13, label: "Tài khoản quản trị", icon: "users", phase: "8e", roles: ["admin"], description: "Tài khoản quản trị và phân quyền." },
];

/** Sidebar sections. */
export const adminGroups: { title: string; slugs: string[] }[] = [
  { title: "Tiếp nhận", slugs: ["lich-hen", "tu-van"] },
  { title: "Sản phẩm", slugs: ["vac-xin", "danh-muc", "goi-vac-xin", "goi-y"] },
  { title: "Nội dung", slugs: ["trung-tam", "doi-ngu", "bai-viet", "banner", "chinh-sach", "cai-dat"] },
  { title: "Hệ thống", slugs: ["tai-khoan"] },
];

export const phaseLabel = { "8c": "Phase 8c", "8d": "Phase 8d", "8e": "Phase 8e" } as const;

export function modulesFor(role: "admin" | "editor") {
  return adminModules.filter((module) => !module.roles || module.roles.includes(role));
}
