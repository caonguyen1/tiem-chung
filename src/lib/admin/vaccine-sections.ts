/** The detail-page sections of a vaccine, in the order the page shows them (spec page 4). */
export const vaccineSectionDefs = [
  { key: "gioi-thieu", title: "Giới thiệu vắc xin" },
  { key: "benh-ly", title: "Thông tin bệnh lý" },
  { key: "lich-tiem", title: "Phác đồ và lịch tiêm" },
  { key: "chong-chi-dinh", title: "Chống chỉ định" },
  { key: "chuyen-doi", title: "Chuyển đổi vắc xin" },
  { key: "mang-thai", title: "Lưu ý với phụ nữ mang thai và cho con bú" },
  { key: "hoan-tiem", title: "Trường hợp cần hoãn tiêm" },
  { key: "luu-y", title: "Chú ý khác" },
] as const;

export const FAQ_SLOTS = 6;
export const GALLERY_SLOTS = 4;
