import type { BrandIconName } from "@/components/icons/brand-icons";

import type { HeroBanner, OutbreakAlert, SiteSettings } from "./types";

// Placeholder values from the client's files. The admin "Menu & thông tin chung"
// module owns all of this; nothing here should be copied into components.
export const siteSettings: SiteSettings = {
  name: "Trung tâm Tiêm chủng Tâm Trí",
  shortName: "Tiêm chủng Tâm Trí",
  slogan: "Tận tâm đồng hành cùng bạn",
  description:
    "Tiêm chủng vắc xin cho mẹ, bé và cả gia đình tại Quy Nhơn, Gia Lai. 100% khách hàng được bác sĩ khám sàng lọc, theo dõi sau tiêm 30 phút và nhắc lịch qua Zalo.",
  hotline: { display: "*3979", dial: "*3979", note: "Phím 1 – Tư vấn & đặt lịch" },
  phone: { display: "0593 888 666", dial: "0593888666" },
  email: "lienhe@tamtrihealthcare.vn",
  address: "424 Nguyễn Thị Minh Khai, P. Quy Nhơn Nam, T. Gia Lai",
  openingHours: "7:30 – 20:00, tất cả các ngày trong tuần",
  zaloUrl: "https://zalo.me/0593888666",
  facebookUrl: "",
  youtubeUrl: "",
  mainMenu: [
    { label: "Vắc xin phòng bệnh", href: "/vac-xin" },
    { label: "Gói vắc xin", href: "/goi-vac-xin" },
    { label: "Khuyến mãi", href: "/khuyen-mai" },
    { label: "Tôi nên tiêm gì?", href: "/toi-nen-tiem-gi" },
    { label: "Về chúng tôi", href: "/gioi-thieu" },
    { label: "Kiến thức tiêm chủng", href: "/kien-thuc" },
  ],
  secondaryMenu: [
    { label: "Hệ thống tiêm chủng", href: "/he-thong-trung-tam" },
    { label: "Đội ngũ chuyên môn", href: "/doi-ngu-chuyen-mon" },
    { label: "Bảng giá tiêm chủng", href: "/bang-gia" },
    { label: "Yêu cầu tư vấn", href: "#tu-van" },
  ],
  policyMenu: [
    { label: "Quy chế hoạt động", href: "/chinh-sach/quy-che-hoat-dong" },
    { label: "Chính sách bảo mật", href: "/chinh-sach/bao-mat" },
    { label: "Chính sách thanh toán", href: "/chinh-sach/thanh-toan" },
    { label: "Chính sách đổi trả", href: "/chinh-sach/doi-tra" },
    { label: "Chính sách nội dung", href: "/chinh-sach/noi-dung" },
  ],
};

// Banner artwork is generated from scripts/banners/*.html (bash scripts/banners/render.sh).
// The admin will upload finished images instead.
export const heroBanners: HeroBanner[] = [
  {
    id: "gioi-thieu",
    alt: "Trung tâm Tiêm chủng Tâm Trí – thuộc hệ sinh thái y tế Tâm Trí cùng Phòng khám Sản – Nhi và Nhà thuốc",
    href: "#dat-lich",
    imageDesktop: "/images/banners/gioi-thieu-pc.jpg",
    imageMobile: "/images/banners/gioi-thieu-mb.jpg",
    actions: [
      { label: "Đặt lịch tiêm", href: "#dat-lich" },
      { label: "Tra cứu vắc xin", href: "#tra-cuu-vac-xin" },
    ],
  },
  {
    id: "tron-goi",
    alt: "Trọn gói tiêm chủng cho cả gia đình – bác sĩ khám sàng lọc, vắc xin chính hãng, theo dõi sau tiêm, nhắc lịch qua Zalo",
    href: "#goi-vac-xin",
    imageDesktop: "/images/banners/tron-goi-pc.jpg",
    imageMobile: "/images/banners/tron-goi-mb.jpg",
  },
  {
    id: "me-va-be",
    alt: "Có bác sĩ Sản và Nhi đồng hành từng mũi tiêm cho mẹ và bé",
    href: "#tu-van",
    imageDesktop: "/images/banners/me-va-be-pc.jpg",
    imageMobile: "/images/banners/me-va-be-mb.jpg",
  },
  {
    id: "sot-xuat-huyet",
    alt: "Sốt xuất huyết vào mùa cao điểm – tiêm vắc xin Qdenga phòng cả 4 tuýp virus Dengue",
    href: "#dat-lich=qdenga",
    imageDesktop: "/images/banners/sot-xuat-huyet-pc.jpg",
    imageMobile: "/images/banners/sot-xuat-huyet-mb.jpg",
  },
  {
    id: "khai-truong",
    alt: "Tiêm chủng Tâm Trí Quy Nhơn khai trương ngày 08.11.2026 tại 424 Nguyễn Thị Minh Khai",
    href: "#lien-he",
    imageDesktop: "/images/banners/khai-truong-pc.jpg",
    imageMobile: "/images/banners/khai-truong-mb.jpg",
  },
];

// Sample alerts; the admin "Bài viết" module flags which posts are outbreak alerts.
export const outbreakAlerts: OutbreakAlert[] = [
  {
    id: "sot-xuat-huyet",
    level: "high",
    title: "Sốt xuất huyết đang vào mùa cao điểm",
    summary: "Số ca mắc tại Gia Lai tăng trong tháng 10. Vắc xin Qdenga phòng được cả 4 tuýp virus Dengue.",
    href: "/kien-thuc/bai-viet/sot-xuat-huyet-mua-cao-diem",
  },
  {
    id: "cum-mua",
    level: "watch",
    title: "Cúm mùa tăng khi thời tiết chuyển lạnh",
    summary: "Nên tiêm nhắc vắc xin cúm mỗi năm, đặc biệt cho trẻ nhỏ, mẹ bầu và người trên 60 tuổi.",
    href: "/kien-thuc/bai-viet/cum-mua",
  },
  {
    id: "tay-chan-mieng",
    level: "high",
    title: "Tay chân miệng ở trẻ dưới 5 tuổi",
    summary: "Theo dõi sốt, loét miệng, phát ban tay chân; đưa bé đi khám ngay khi sốt cao không hạ.",
    href: "/kien-thuc/bai-viet/tay-chan-mieng",
  },
  {
    id: "soi",
    level: "watch",
    title: "Sởi có thể quay lại ở trẻ chưa tiêm đủ mũi",
    summary: "Kiểm tra lịch tiêm sởi – quai bị – rubella của bé ở mốc 9 và 18 tháng.",
    href: "/kien-thuc/bai-viet/phong-soi",
  },
];

// "Vì sao chọn Tâm Trí" – wording agreed with the client (2026-10-26). Keep it to
// commitments the center actually delivers.
export const whyChooseUs: { icon: BrandIconName; title: string; text: string }[] = [
  { icon: "stethoscope", title: "Bác sĩ khám sàng lọc", text: "Khám sàng lọc, tư vấn trước tiêm theo quy trình chuyên môn." },
  { icon: "shield", title: "Vắc xin rõ nguồn gốc", text: "Nguồn gốc, điều kiện bảo quản được kiểm soát." },
  { icon: "timer", title: "Theo dõi sau tiêm", text: "Theo dõi tại cơ sở theo thời gian và quy trình chuyên môn." },
  { icon: "reminder", title: "Nhắc lịch tiêm", text: "Hỗ trợ nhắc lịch các mũi tiếp theo." },
];

// Sample FAQ; the admin will manage these.
export const faqs: { question: string; answer: string }[] = [
  {
    question: "Có cần đặt lịch trước khi đến tiêm không?",
    answer:
      "Nên đặt lịch trước để được sắp xếp khám sàng lọc và tiêm nhanh hơn. Bạn đặt lịch ngay trên website, qua hotline hoặc Zalo; trung tâm vẫn tiếp nhận khách đến trực tiếp.",
  },
  {
    question: "Trước khi tiêm cần chuẩn bị gì?",
    answer:
      "Mang theo sổ hoặc phiếu tiêm chủng, báo cho bác sĩ tình trạng sức khỏe hiện tại, thuốc đang dùng, tiền sử dị ứng và phản ứng ở các lần tiêm trước.",
  },
  {
    question: "Bé đang ốm nhẹ có tiêm được không?",
    answer:
      "Bác sĩ sẽ khám sàng lọc và quyết định. Với trường hợp đang sốt hoặc mắc bệnh cấp tính, bác sĩ có thể hẹn hoãn tiêm sang ngày khác.",
  },
  {
    question: "Sau tiêm cần theo dõi như thế nào?",
    answer:
      "Bạn ở lại trung tâm để được theo dõi theo quy trình. Khi về nhà tiếp tục theo dõi nhiệt độ, chỗ tiêm và liên hệ ngay nếu có dấu hiệu bất thường.",
  },
  {
    question: "Tâm Trí có tiêm cho người lớn và mẹ bầu không?",
    answer:
      "Có. Trung tâm tiêm cho trẻ em, phụ nữ chuẩn bị mang thai, phụ nữ mang thai, người lớn và người có bệnh mạn tính theo chỉ định.",
  },
];
