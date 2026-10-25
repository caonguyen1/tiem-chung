import type { Article, ArticleCategory, Center, Doctor } from "./types";

// BSCKII. Đỗ Văn Tâm is from the client's vaccination book; the other doctors are
// placeholders until the admin "Đội ngũ chuyên môn" module is filled in.
export const doctors: Doctor[] = [
  {
    slug: "do-van-tam",
    title: "BSCKII.",
    name: "Đỗ Văn Tâm",
    specialty: "Giám đốc Hệ thống Y tế Tâm Trí",
    photo: "/images/doctor-do-van-tam.jpg",
    quote: "Mỗi cột mốc của mẹ và con đều đáng được chăm sóc bằng sự tận tâm và thấu hiểu.",
  },
  { slug: "bac-si-san", title: "ThS. BS.", name: "Nguyễn Thị Minh Thư", specialty: "Sản phụ khoa" },
  { slug: "bac-si-nhi", title: "BSCKI.", name: "Trần Quốc Huy", specialty: "Nhi khoa" },
  { slug: "bac-si-noi", title: "BS.", name: "Lê Hoàng Anh", specialty: "Khám sàng lọc – Nội tổng quát" },
];

export const articleCategories: ArticleCategory[] = [
  { slug: "me-va-be", name: "Mẹ & Bé" },
  { slug: "dinh-duong", name: "Dinh dưỡng" },
  { slug: "cham-soc-suc-khoe", name: "Chăm sóc sức khỏe" },
  { slug: "suc-khoe-gioi-tinh", name: "Sức khỏe giới tính" },
  { slug: "nhi", name: "Nhi" },
  { slug: "thanh-thieu-nien", name: "Thanh thiếu niên" },
];

// Topics taken from the "Sổ tiêm chủng Tâm Trí" booklet.
export const articles: Article[] = [
  {
    slug: "kham-sang-loc-truoc-tiem-chung",
    title: "Khám sàng lọc trước tiêm chủng: những thông tin ba mẹ cần biết",
    excerpt:
      "Vì sao bác sĩ phải khám trước mỗi mũi tiêm, cần báo những gì về sức khỏe của bé và bác sĩ sẽ khám như thế nào theo quy định của Bộ Y tế.",
    categorySlug: "me-va-be",
    image: "/images/screening.jpg",
    views: 4210,
    publishedAt: "2026-10-20",
    reviewedBy: "BSCKII. Đỗ Văn Tâm",
  },
  {
    slug: "phan-ung-thuong-gap-sau-tiem",
    title: "Những phản ứng thường gặp sau tiêm và cách chăm sóc tại nhà",
    excerpt: "Sốt nhẹ, sưng đau chỗ tiêm có đáng lo? Khi nào cần đưa bé quay lại cơ sở y tế ngay.",
    categorySlug: "nhi",
    image: "/images/interior-waiting.jpg",
    views: 3120,
    publishedAt: "2026-10-18",
  },
  {
    slug: "tiem-chung-truoc-mang-thai",
    title: "Chuẩn bị mang thai: nên tiêm những vắc xin nào và trước bao lâu?",
    excerpt: "Sởi – quai bị – rubella, thủy đậu, cúm… và khoảng cách an toàn trước khi có thai.",
    categorySlug: "suc-khoe-gioi-tinh",
    image: "/images/family.jpg",
    views: 2860,
    publishedAt: "2026-10-15",
  },
  {
    slug: "sot-xuat-huyet-mua-cao-diem",
    title: "Sốt xuất huyết mùa cao điểm: dấu hiệu cảnh báo và cách phòng",
    excerpt: "Vắc xin Qdenga, diệt lăng quăng và những dấu hiệu nặng không được bỏ qua.",
    categorySlug: "cham-soc-suc-khoe",
    image: "/images/interior-reception.jpg",
    views: 1980,
    publishedAt: "2026-10-12",
  },
  {
    slug: "bang-chieu-cao-can-nang-chuan",
    title: "Bảng chiều cao – cân nặng chuẩn của bé từ 0 đến 5 tuổi",
    excerpt: "Theo dõi tăng trưởng cùng lịch tiêm để biết bé đang phát triển đúng hướng.",
    categorySlug: "dinh-duong",
    image: "/images/interior-pharmacy.jpg",
    views: 5340,
    publishedAt: "2026-10-08",
  },
];

export const centers: Center[] = [
  {
    slug: "quy-nhon",
    name: "Tâm Trí Quy Nhơn",
    address: "424 Nguyễn Thị Minh Khai, P. Quy Nhơn Nam, T. Gia Lai",
    province: "Gia Lai",
    openingHours: "7:30 – 20:00 hằng ngày",
    phone: "0593 888 666",
    image: "/images/facade.jpg",
    mapUrl: "https://maps.google.com/?q=424+Nguyen+Thi+Minh+Khai+Quy+Nhon",
  },
];
