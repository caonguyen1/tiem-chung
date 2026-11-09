import type { AboutContent, ContentSection, Faq, PolicyPage } from "./types";

/*
 * Sample detail content for the pages built in phases 2–6. All of it is placeholder text that the
 * admin replaces (modules 1, 3, 8, 9, 11, 12). Medical wording is deliberately general: the
 * doctor who reviews each vaccine must confirm it before launch ("Bác sĩ kiểm duyệt").
 */

/* ---------- Vaccines ---------- */

/** Age ranges (slugs from recommendations.ts) and doses in a full course, per vaccine. */
export const vaccineFacts: Record<string, { ages: string[]; doses: number; unit: string }> = {
  "gardasil-9": { ages: ["9-18-tuoi", "18-45-tuoi"], doses: 3, unit: "Liều 0,5 ml" },
  gardasil: { ages: ["9-18-tuoi", "18-45-tuoi"], doses: 3, unit: "Liều 0,5 ml" },
  "prevenar-20": { ages: ["0-6-thang", "6-24-thang", "2-9-tuoi", "18-45-tuoi", "tren-45-tuoi"], doses: 4, unit: "Liều 0,5 ml" },
  vaxneuvance: { ages: ["0-6-thang", "6-24-thang", "2-9-tuoi"], doses: 4, unit: "Liều 0,5 ml" },
  "prevenar-13": { ages: ["0-6-thang", "6-24-thang", "2-9-tuoi"], doses: 4, unit: "Liều 0,5 ml" },
  synflorix: { ages: ["0-6-thang", "6-24-thang", "2-9-tuoi"], doses: 4, unit: "Liều 0,5 ml" },
  "vaxigrip-tetra": { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi", "tren-45-tuoi"], doses: 1, unit: "Liều 0,5 ml" },
  "influvac-tetra": { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi", "tren-45-tuoi"], doses: 1, unit: "Liều 0,5 ml" },
  "gc-flu": { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi", "tren-45-tuoi"], doses: 1, unit: "Liều 0,5 ml" },
  "ivacflu-s": { ages: ["18-45-tuoi", "tren-45-tuoi"], doses: 1, unit: "Liều 0,5 ml" },
  qdenga: { ages: ["2-9-tuoi", "9-18-tuoi", "18-45-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  hexaxim: { ages: ["0-6-thang", "6-24-thang"], doses: 4, unit: "Liều 0,5 ml" },
  "infanrix-hexa": { ages: ["0-6-thang", "6-24-thang"], doses: 4, unit: "Liều 0,5 ml" },
  rotateq: { ages: ["0-6-thang"], doses: 3, unit: "Liều uống 2 ml" },
  rotarix: { ages: ["0-6-thang"], doses: 2, unit: "Liều uống 1,5 ml" },
  "mmr-ii": { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  priorix: { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  proquad: { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  "vac-xin-tay-chan-mieng": { ages: ["6-24-thang", "2-9-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  twinrix: { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi", "tren-45-tuoi"], doses: 3, unit: "Liều 1 ml" },
  havrix: { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  imojev: { ages: ["6-24-thang", "2-9-tuoi", "9-18-tuoi", "18-45-tuoi"], doses: 2, unit: "Liều 0,5 ml" },
  abrysvo: { ages: ["18-45-tuoi", "tren-45-tuoi"], doses: 1, unit: "Liều 0,5 ml" },
};

const diseaseInfo: Record<string, string> = {
  "phe-cau": "Phế cầu khuẩn là vi khuẩn lây qua đường hô hấp. Bệnh có thể gây viêm phổi, viêm tai giữa, viêm màng não và nhiễm khuẩn huyết, nặng nhất ở trẻ nhỏ và người lớn tuổi.",
  "6-trong-1": "Vắc xin 6 trong 1 phòng cùng lúc bạch hầu, ho gà, uốn ván, bại liệt, viêm gan B và bệnh do vi khuẩn Hib (viêm màng não mủ, viêm phổi, viêm họng nặng).",
  rotavirus: "Rotavirus lây qua đường tiêu hóa, gây tiêu chảy cấp, nôn và mất nước ở trẻ nhỏ. Đây là nguyên nhân thường gặp khiến trẻ phải nhập viện vì tiêu chảy.",
  cum: "Cúm mùa lây rất nhanh qua giọt bắn. Bệnh gây sốt, đau người, ho; ở trẻ nhỏ, người lớn tuổi và người có bệnh nền có thể dẫn tới biến chứng viêm phổi.",
  "soi-quai-bi-rubella": "Sởi, quai bị và rubella đều là bệnh do virus lây qua đường hô hấp. Sởi có thể gây viêm phổi, viêm não; rubella ở phụ nữ mang thai có thể ảnh hưởng đến thai nhi.",
  "thuy-dau": "Thủy đậu do virus Varicella-zoster gây ra, lây qua đường hô hấp và tiếp xúc, gây sốt và phát ban dạng bọng nước; có thể bội nhiễm da hoặc viêm phổi.",
  hpv: "HPV là virus lây qua đường tình dục. Một số tuýp HPV nguy cơ cao gây ung thư cổ tử cung, hậu môn, vùng họng; số tuýp khác gây sùi mào gà.",
  "sot-xuat-huyet": "Sốt xuất huyết do virus Dengue lây qua muỗi vằn đốt. Bệnh gây sốt cao, đau đầu, xuất huyết; một số trường hợp tiến triển nặng cần theo dõi tại cơ sở y tế.",
  "tay-chan-mieng": "Tay chân miệng do virus đường ruột gây ra, thường gặp ở trẻ dưới 5 tuổi, với biểu hiện sốt, loét miệng và nổi bọng nước ở tay, chân.",
  "viem-gan": "Viêm gan A lây qua thức ăn, nước uống nhiễm virus; viêm gan B lây qua máu, mẹ truyền sang con và đường tình dục. Cả hai ảnh hưởng đến gan.",
  "viem-nao-nhat-ban": "Viêm não Nhật Bản do virus lây qua muỗi đốt. Bệnh ít gặp nhưng có thể gây tổn thương não nặng, để lại di chứng thần kinh.",
  rsv: "RSV là virus gây nhiễm trùng đường hô hấp, có thể gây viêm tiểu phế quản và viêm phổi ở trẻ nhỏ, người lớn tuổi. Tiêm cho mẹ trong thai kỳ giúp bảo vệ trẻ sơ sinh những tháng đầu đời.",
};

export function vaccineSections(vaccine: { name: string; prevents: string; audience: string; origin: string; manufacturer: string }, diseases: string[]): ContentSection[] {
  return [
    {
      key: "gioi-thieu",
      title: "Giới thiệu vắc xin",
      body: `${vaccine.name} do ${vaccine.manufacturer} (${vaccine.origin}) sản xuất, giúp phòng: ${vaccine.prevents.charAt(0).toLowerCase()}${vaccine.prevents.slice(1)}.\n\nĐối tượng tiêm: ${vaccine.audience}.`,
    },
    {
      key: "benh-ly",
      title: "Thông tin bệnh lý",
      body: diseases.map((slug) => diseaseInfo[slug]).filter(Boolean).join("\n\n"),
    },
    {
      key: "lich-tiem",
      title: "Phác đồ và lịch tiêm",
      body: "Số mũi và khoảng cách giữa các mũi phụ thuộc vào độ tuổi bắt đầu tiêm và tiền sử tiêm chủng của người được tiêm.\n\nBác sĩ sẽ khám sàng lọc, kiểm tra sổ tiêm chủng rồi đưa ra lịch tiêm phù hợp tại buổi hẹn. Nếu lỡ lịch, bạn không cần tiêm lại từ đầu; hãy đến sớm nhất có thể để bác sĩ sắp xếp lại.",
    },
    {
      key: "chong-chi-dinh",
      title: "Chống chỉ định",
      body: "- Người từng bị phản ứng dị ứng nặng với bất kỳ thành phần nào của vắc xin hoặc sau liều tiêm trước đó.\n- Đang sốt cao hoặc mắc bệnh cấp tính: hoãn tiêm cho tới khi khỏi.\n- Các trường hợp khác do bác sĩ quyết định sau khi khám sàng lọc.",
    },
    {
      key: "chuyen-doi",
      title: "Chuyển đổi vắc xin",
      body: "Việc đổi từ loại vắc xin này sang loại khác trong cùng một phác đồ cần có chỉ định của bác sĩ. Hãy mang theo sổ tiêm chủng hoặc thông tin các mũi đã tiêm để được tư vấn chính xác.",
    },
    {
      key: "mang-thai",
      title: "Lưu ý với phụ nữ mang thai và cho con bú",
      body: "Không phải loại vắc xin nào cũng phù hợp trong thai kỳ. Hãy báo cho bác sĩ nếu bạn đang mang thai, đang chuẩn bị mang thai hoặc đang cho con bú để được tư vấn trước khi tiêm.",
    },
    {
      key: "hoan-tiem",
      title: "Trường hợp cần hoãn tiêm",
      body: "- Đang sốt hoặc có biểu hiện bệnh cấp tính.\n- Vừa dùng thuốc ức chế miễn dịch hoặc truyền chế phẩm máu (bác sĩ sẽ cho biết thời gian chờ).\n- Các trường hợp khác theo kết quả khám sàng lọc.",
    },
    {
      key: "luu-y",
      title: "Chú ý khác",
      body: "- Ở lại theo dõi 30 phút tại trung tâm sau khi tiêm.\n- Sốt nhẹ, đau hoặc sưng chỗ tiêm có thể gặp trong 1–2 ngày đầu; theo dõi tại nhà theo hướng dẫn của bác sĩ.\n- Quay lại cơ sở y tế ngay nếu có sốt cao, khó thở, nổi mề đay, li bì hoặc co giật.",
    },
  ];
}

export function vaccineFaqs(name: string): Faq[] {
  return [
    {
      question: `Tiêm ${name} có đau không và có phản ứng gì sau tiêm?`,
      answer: "Một số người thấy đau, sưng hoặc đỏ nhẹ tại chỗ tiêm và sốt nhẹ trong 1–2 ngày đầu. Phần lớn các phản ứng này tự hết. Bác sĩ sẽ hướng dẫn cách theo dõi và các dấu hiệu cần quay lại cơ sở y tế.",
    },
    {
      question: "Có thể tiêm cùng lúc với vắc xin khác không?",
      answer: "Nhiều loại vắc xin có thể tiêm cùng buổi ở các vị trí khác nhau. Bác sĩ sẽ cân nhắc dựa trên độ tuổi, tiền sử tiêm chủng và loại vắc xin để sắp xếp lịch hợp lý.",
    },
    {
      question: "Cần chuẩn bị gì trước khi đến tiêm?",
      answer: "Mang theo sổ tiêm chủng (nếu có), giữ trẻ khỏe mạnh, ăn uống bình thường và báo cho bác sĩ tình trạng sức khỏe, thuốc đang dùng và tiền sử dị ứng. Bác sĩ khám sàng lọc trước mỗi mũi tiêm.",
    },
  ];
}

export const vaccineDisclaimer =
  "Nội dung trên chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ. Chỉ định tiêm, số mũi và lịch tiêm cụ thể do bác sĩ quyết định sau khi khám sàng lọc.";

/* ---------- Packages ---------- */

export const packageDescriptions: Record<string, string> = {
  "goi-0-6-thang": "Những mũi tiêm nền tảng cho bé trong 6 tháng đầu đời, bác sĩ sắp lịch từng mũi và nhắc bạn trước ngày hẹn.",
  "goi-0-12-thang": "Lịch tiêm trọn năm đầu đời, nối tiếp gói 0–6 tháng với các mũi dành cho bé từ 6 đến 12 tháng.",
  "goi-0-24-thang": "Gói đầy đủ nhất cho 2 năm đầu, gồm các mũi nền tảng và các mũi nhắc lại quan trọng.",
  "goi-tien-hoc-duong": "Rà soát và bổ sung các mũi cần thiết trước khi bé vào lớp 1, nơi bé bắt đầu tiếp xúc tập thể đông.",
  "goi-thanh-thieu-nien": "Gói cho tuổi 9–18, trong đó có vắc xin phòng HPV và các mũi nhắc lại theo chỉ định bác sĩ.",
  "goi-nguoi-truong-thanh": "Gói bảo vệ cho người từ 18 tuổi: cúm, viêm gan, HPV và các mũi còn thiếu theo sổ tiêm chủng.",
  "goi-tien-hon-nhan": "Dành cho hai bạn chuẩn bị kết hôn, hoàn thiện các mũi cần thiết trước khi có em bé.",
  "goi-truoc-mang-thai": "Nên hoàn thành ít nhất 1–3 tháng trước khi mang thai; bác sĩ Sản khoa tư vấn lịch phù hợp.",
  "goi-mang-thai": "Các mũi tiêm phù hợp trong thai kỳ để bảo vệ mẹ và bé những tháng đầu, theo chỉ định của bác sĩ Sản khoa.",
  "goi-benh-man-tinh": "Dành cho người có bệnh nền như tiểu đường, tim mạch, hô hấp, nhóm dễ biến chứng nặng khi mắc bệnh truyền nhiễm.",
};

/** Doses inside each package. The admin chooses vaccines and doses per package (module 3). */
export const packageContents: Record<string, { vaccine: string; doses: number }[]> = {
  "goi-0-6-thang": [
    { vaccine: "hexaxim", doses: 3 },
    { vaccine: "prevenar-13", doses: 3 },
    { vaccine: "rotateq", doses: 3 },
  ],
  "goi-0-12-thang": [
    { vaccine: "hexaxim", doses: 3 },
    { vaccine: "prevenar-13", doses: 3 },
    { vaccine: "rotateq", doses: 3 },
    { vaccine: "vaxigrip-tetra", doses: 2 },
    { vaccine: "priorix", doses: 1 },
    { vaccine: "imojev", doses: 1 },
  ],
  "goi-0-24-thang": [
    { vaccine: "hexaxim", doses: 4 },
    { vaccine: "prevenar-13", doses: 4 },
    { vaccine: "rotateq", doses: 3 },
    { vaccine: "vaxigrip-tetra", doses: 3 },
    { vaccine: "priorix", doses: 2 },
    { vaccine: "imojev", doses: 2 },
    { vaccine: "havrix", doses: 2 },
  ],
  "goi-tien-hoc-duong": [
    { vaccine: "vaxigrip-tetra", doses: 1 },
    { vaccine: "proquad", doses: 2 },
    { vaccine: "havrix", doses: 2 },
    { vaccine: "qdenga", doses: 2 },
    { vaccine: "gardasil-9", doses: 2 },
  ],
  "goi-thanh-thieu-nien": [
    { vaccine: "gardasil-9", doses: 2 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
    { vaccine: "qdenga", doses: 2 },
    { vaccine: "twinrix", doses: 3 },
    { vaccine: "mmr-ii", doses: 2 },
  ],
  "goi-nguoi-truong-thanh": [
    { vaccine: "gardasil-9", doses: 3 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
    { vaccine: "twinrix", doses: 3 },
    { vaccine: "mmr-ii", doses: 2 },
    { vaccine: "qdenga", doses: 2 },
    { vaccine: "prevenar-20", doses: 1 },
  ],
  "goi-tien-hon-nhan": [
    { vaccine: "gardasil-9", doses: 3 },
    { vaccine: "proquad", doses: 2 },
    { vaccine: "twinrix", doses: 3 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
  ],
  "goi-truoc-mang-thai": [
    { vaccine: "proquad", doses: 2 },
    { vaccine: "twinrix", doses: 3 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
    { vaccine: "prevenar-20", doses: 1 },
  ],
  "goi-mang-thai": [
    { vaccine: "abrysvo", doses: 1 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
  ],
  "goi-benh-man-tinh": [
    { vaccine: "prevenar-20", doses: 1 },
    { vaccine: "vaxigrip-tetra", doses: 1 },
    { vaccine: "twinrix", doses: 3 },
  ],
};

/* ---------- Doctors ---------- */

export const doctorDetails: Record<string, { bio: string; experience: string }> = {
  "do-van-tam": {
    bio: "Bác sĩ chuyên khoa II Đỗ Văn Tâm là Giám đốc Hệ thống Y tế Tâm Trí, người định hướng chuyên môn cho cả Phòng khám Sản – Nhi, Nhà thuốc và Trung tâm Tiêm chủng. Bác sĩ trực tiếp đặt ra quy trình khám sàng lọc trước tiêm của trung tâm.",
    experience: "Nhiều năm làm việc trong lĩnh vực sản – nhi tại tuyến tỉnh.\nGiám đốc Hệ thống Y tế Tâm Trí.\nPhụ trách kiểm duyệt nội dung chuyên môn trên website.",
  },
  "bac-si-san": {
    bio: "Bác sĩ Sản phụ khoa tư vấn tiêm chủng cho phụ nữ trước và trong thai kỳ, đồng hành cùng các mẹ từ lúc chuẩn bị mang thai đến sau sinh.",
    experience: "Khám và theo dõi thai kỳ.\nTư vấn tiêm chủng tiền hôn nhân, trước mang thai và thai kỳ.",
  },
  "bac-si-nhi": {
    bio: "Bác sĩ Nhi khoa theo dõi sức khỏe và lịch tiêm cho trẻ từ sơ sinh đến tuổi học đường, hướng dẫn ba mẹ chăm sóc bé sau tiêm.",
    experience: "Khám sàng lọc trước tiêm cho trẻ em.\nTheo dõi tăng trưởng và dinh dưỡng của trẻ.",
  },
  "bac-si-noi": {
    bio: "Bác sĩ khám sàng lọc trước tiêm cho trẻ lớn và người trưởng thành, rà soát bệnh nền và thuốc đang dùng để chỉ định tiêm an toàn.",
    experience: "Khám sàng lọc trước tiêm.\nTư vấn tiêm chủng cho người trưởng thành và người có bệnh nền.",
  },
};

/* ---------- Centers ---------- */

export const centerDetails: Record<string, { addressOld: string; ward: string; latitude: number; longitude: number }> = {
  "quy-nhon": {
    addressOld: "424 Nguyễn Thị Minh Khai, P. Nguyễn Văn Cừ, TP. Quy Nhơn, T. Bình Định",
    ward: "P. Quy Nhơn Nam",
    latitude: 13.7587829,
    longitude: 109.2117828,
  },
};

/* ---------- Articles ---------- */

export const articleBodies: Record<string, string> = {
  "phan-ung-thuong-gap-sau-tiem":
    "Phần lớn trẻ sau tiêm chỉ có phản ứng nhẹ và tự hết trong vài ngày.\n\n## Phản ứng thường gặp\n- Đau, sưng hoặc đỏ nhẹ ở chỗ tiêm.\n- Sốt nhẹ, quấy khóc, bú kém hơn bình thường trong 1–2 ngày.\n\n## Chăm sóc tại nhà\n- Cho bé bú hoặc uống đủ nước, mặc quần áo thoáng.\n- Theo dõi nhiệt độ; dùng thuốc hạ sốt theo hướng dẫn của bác sĩ.\n- Không đắp lá, không xoa bóp mạnh chỗ tiêm.\n\n## Khi nào cần đưa bé đi khám ngay\n- Sốt cao liên tục, khóc thét không dỗ được.\n- Khó thở, tím tái, nổi mề đay, co giật hoặc li bì.\n- Chỗ tiêm sưng nóng đỏ lan rộng.\n\nNếu lo lắng, ba mẹ hãy gọi tổng đài của Tâm Trí để được tư vấn.",
  "kham-sang-loc-truoc-tiem-chung":
    "Khám sàng lọc là bước bắt buộc trước mỗi mũi tiêm để bác sĩ biết người được tiêm có đủ điều kiện hay cần hoãn.\n\n## Bác sĩ sẽ hỏi và khám gì\n- Tiền sử bệnh, dị ứng, các mũi đã tiêm và phản ứng sau tiêm trước đó.\n- Đo nhiệt độ, nghe tim phổi, khám tổng quát.\n\n## Ba mẹ cần chuẩn bị\n- Sổ tiêm chủng hoặc thông tin các mũi đã tiêm.\n- Thông tin thuốc bé đang dùng và tình trạng sức khỏe những ngày gần đây.\n\nSau khi khám, bác sĩ chỉ định tiêm, hoãn tiêm hoặc tư vấn thêm. Bé được theo dõi 30 phút sau tiêm tại trung tâm.",
  "lich-tiem-chung-cho-be-0-24-thang":
    "Hai năm đầu đời là giai đoạn bé cần nhiều mũi tiêm nhất.\n\n## Những nhóm bệnh cần chú ý\n- Bệnh phối hợp 6 trong 1 (bạch hầu, ho gà, uốn ván, bại liệt, viêm gan B, Hib).\n- Phế cầu khuẩn, Rotavirus.\n- Cúm mùa, sởi – quai bị – rubella, thủy đậu, viêm não Nhật Bản.\n\n## Lưu ý\n- Lịch cụ thể phụ thuộc tuổi bắt đầu tiêm và tiền sử của bé, do bác sĩ quyết định.\n- Nếu lỡ mũi, hãy đưa bé đến sớm; thường không cần tiêm lại từ đầu.\n\nBa mẹ có thể xem các gói theo độ tuổi hoặc yêu cầu bác sĩ tư vấn lịch riêng cho bé.",
  "tiem-chung-truoc-mang-thai":
    "Một số bệnh như rubella, thủy đậu, cúm có thể ảnh hưởng đến thai kỳ. Tiêm phòng trước khi mang thai giúp mẹ chủ động hơn.\n\n## Nên làm gì\n- Đến khám với bác sĩ Sản khoa ít nhất 3 tháng trước khi dự định có thai.\n- Mang theo thông tin các mũi đã tiêm.\n\n## Lưu ý\n- Một số vắc xin sống cần cách một khoảng thời gian trước khi có thai; bác sĩ sẽ hướng dẫn cụ thể.\n- Phụ nữ đã mang thai cần báo ngay cho bác sĩ trước khi tiêm.",
  "sot-xuat-huyet-mua-cao-diem":
    "Sốt xuất huyết thường tăng vào mùa mưa. Muỗi vằn đốt cả ban ngày, nên cần phòng bệnh ở nhà và nơi học tập.\n\n## Nhận biết sớm\n- Sốt cao đột ngột, đau đầu, đau sau hốc mắt, đau cơ.\n- Chảy máu chân răng, chảy máu cam, nổi chấm xuất huyết.\n\n## Phòng bệnh\n- Diệt lăng quăng, đậy kín dụng cụ chứa nước, ngủ màn.\n- Dùng thuốc xua muỗi.\n- Trao đổi với bác sĩ về vắc xin phòng sốt xuất huyết nếu phù hợp với độ tuổi.\n\nKhi nghi ngờ mắc bệnh, hãy đến cơ sở y tế sớm; không tự ý dùng thuốc hạ sốt nhóm có thể gây chảy máu.",
  "cum-mua":
    "Cúm mùa lây qua giọt bắn và tiếp xúc, tăng khi thời tiết chuyển lạnh.\n\n## Vì sao cần tiêm hằng năm\n- Virus cúm biến đổi nên vắc xin được cập nhật theo mùa.\n- Trẻ nhỏ, người lớn tuổi, phụ nữ mang thai và người có bệnh nền dễ biến chứng nặng.\n\n## Phòng bệnh hằng ngày\n- Rửa tay, đeo khẩu trang nơi đông người.\n- Giữ ấm, ngủ đủ giấc, ăn uống đủ chất.\n\nBác sĩ sẽ tư vấn thời điểm tiêm phù hợp.",
  "tay-chan-mieng":
    "Tay chân miệng thường gặp ở trẻ dưới 5 tuổi và lây qua tiếp xúc với dịch tiết, phân, đồ vật nhiễm virus.\n\n## Dấu hiệu\n- Sốt, loét miệng, nổi bọng nước ở lòng bàn tay, bàn chân, mông.\n- Cần đi khám ngay nếu trẻ sốt cao, giật mình, run chi, nôn nhiều hoặc li bì.\n\n## Phòng bệnh\n- Rửa tay bằng xà phòng, vệ sinh đồ chơi, bề mặt.\n- Cách ly trẻ bệnh theo hướng dẫn.\n- Hỏi bác sĩ về vắc xin phòng tay chân miệng.",
  "phong-soi":
    "Sởi lây rất nhanh trong cộng đồng chưa có miễn dịch.\n\n## Vì sao cần tiêm đủ mũi\n- Sởi có thể gây viêm phổi, viêm não và biến chứng nặng.\n- Hai mũi vắc xin sởi theo lịch giúp bảo vệ tốt hơn một mũi.\n\n## Ba mẹ nên làm gì\n- Kiểm tra sổ tiêm chủng của bé và của người lớn trong nhà.\n- Mang bé đến khám để bác sĩ bổ sung mũi còn thiếu.\n- Cho trẻ nghỉ học khi có biểu hiện sốt, phát ban và đi khám.",
};

/** Promotions are articles in a category flagged as "Khuyến mãi" (admin module 9). */
export const promotionCategory = { slug: "khuyen-mai", name: "Khuyến mãi" };

export const promotions = [
  {
    slug: "uu-dai-thang-11-goi-cho-be",
    title: "Ưu đãi tháng 11: gói vắc xin cho bé tiết kiệm đến 8%",
    excerpt: "Đăng ký gói vắc xin theo độ tuổi trong tháng 11 để nhận mức giá gói thấp hơn tổng giá tiêm lẻ.",
    image: "/images/family.jpg",
    publishedAt: "2026-11-01",
    body: "Trong tháng 11, các gói vắc xin cho bé theo độ tuổi có giá gói thấp hơn tổng giá tiêm lẻ từng mũi, tiết kiệm đến 8%.\n\n## Thời gian\nTừ ngày 01/11 đến hết ngày 30/11/2026.\n\n## Thể lệ\n- Áp dụng cho các gói vắc xin theo độ tuổi hiển thị trên website.\n- Đặt lịch và được bác sĩ khám sàng lọc trước khi tiêm.\n- Chương trình có thể kết thúc sớm hơn khi hết ưu đãi.\n\nNội dung thể lệ là bản mẫu, trung tâm sẽ cập nhật theo quyết định chính thức.",
  },
  {
    slug: "chao-mung-khai-truong-tam-tri",
    title: "Chào mừng Trung tâm Tiêm chủng Tâm Trí chính thức đón khách",
    excerpt: "Thông tin chương trình chào mừng dành cho khách hàng đặt lịch trong tháng đầu hoạt động.",
    image: "/images/facade.jpg",
    publishedAt: "2026-11-05",
    body: "Trung tâm Tiêm chủng Tâm Trí chính thức đón khách tại 424 Nguyễn Thị Minh Khai, Quy Nhơn.\n\n## Chương trình\nChi tiết ưu đãi chào mừng sẽ được trung tâm công bố khi có xác nhận.\n\nHãy gọi tổng đài hoặc đặt lịch trên website để được tư vấn.",
  },
];

/* ---------- Policies ---------- */

export const policyPages: PolicyPage[] = [
  {
    slug: "quy-che-hoat-dong",
    title: "Quy chế hoạt động",
    body: "## 1. Phạm vi\nWebsite giới thiệu dịch vụ tiêm chủng của Trung tâm Tiêm chủng Tâm Trí và hỗ trợ khách đặt lịch, gửi yêu cầu tư vấn.\n\n## 2. Quy trình tiếp nhận\n- Khách chọn vắc xin hoặc gói, gửi thông tin đặt lịch.\n- Nhân viên liên hệ xác nhận lịch hẹn.\n- Trước khi tiêm, bác sĩ khám sàng lọc và chỉ định.\n\n## 3. Trách nhiệm\nThông tin trên website mang tính tham khảo, không thay thế tư vấn của bác sĩ.\n\nĐây là nội dung mẫu, cần trung tâm xác nhận trước khi ra mắt.",
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật",
    body: "## Thông tin chúng tôi thu thập\nHọ tên, số điện thoại, thông tin lịch hẹn mà bạn nhập vào form đặt lịch hoặc yêu cầu tư vấn.\n\n## Mục đích sử dụng\n- Liên hệ xác nhận lịch hẹn và tư vấn.\n- Cải thiện chất lượng dịch vụ.\n\n## Bảo vệ thông tin\nThông tin chỉ được nhân viên có trách nhiệm truy cập và không chia sẻ cho bên thứ ba khi chưa có sự đồng ý của bạn, trừ trường hợp pháp luật yêu cầu.\n\nĐây là nội dung mẫu, cần trung tâm xác nhận trước khi ra mắt.",
  },
  {
    slug: "thanh-toan",
    title: "Chính sách thanh toán",
    body: "## Hình thức thanh toán\nThanh toán trực tiếp tại trung tâm. Các hình thức thanh toán khác sẽ được cập nhật khi trung tâm xác nhận.\n\n## Giá dịch vụ\nGiá hiển thị trên website là giá tham khảo; giá cuối cùng được xác nhận tại trung tâm.\n\nĐây là nội dung mẫu, cần trung tâm xác nhận trước khi ra mắt.",
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    body: "## Nguyên tắc chung\nVắc xin là sản phẩm bảo quản lạnh nghiêm ngặt nên chính sách đổi, trả, hoàn tiền phụ thuộc vào quy định của trung tâm.\n\n## Liên hệ\nVui lòng gọi tổng đài để được hướng dẫn.\n\nĐây là nội dung mẫu, cần trung tâm xác nhận trước khi ra mắt.",
  },
  {
    slug: "noi-dung",
    title: "Chính sách nội dung",
    body: "## Nội dung chuyên môn\nBài viết và thông tin vắc xin được bác sĩ của trung tâm kiểm duyệt trước khi đăng.\n\n## Bản quyền\nNội dung trên website thuộc Trung tâm Tiêm chủng Tâm Trí. Khi trích dẫn, vui lòng ghi rõ nguồn.\n\nĐây là nội dung mẫu, cần trung tâm xác nhận trước khi ra mắt.",
  },
];

/* ---------- About ---------- */

export const about: AboutContent = {
  intro: "Trung tâm Tiêm chủng Tâm Trí thuộc hệ sinh thái y tế Sản – Nhi Tâm Trí tại Quy Nhơn, đồng hành cùng gia đình từ lúc chuẩn bị mang thai đến khi con lớn lên.",
  story: [
    "Tâm Trí bắt đầu từ Phòng khám Sản – Nhi và Nhà thuốc, nơi các bác sĩ đồng hành với nhiều mẹ và bé trong suốt thai kỳ và những năm đầu đời.",
    "Từ nhu cầu của gia đình, Trung tâm Tiêm chủng ra đời để việc tiêm chủng được thực hiện cùng một nơi quen thuộc: bác sĩ khám sàng lọc trước tiêm, vắc xin chính hãng, rõ nguồn gốc và có người nhắc lịch cho lần tiêm kế tiếp.",
    "Chúng tôi giữ một cam kết đơn giản: tận tâm đồng hành cùng bạn.",
  ],
  values: [
    { icon: "stethoscope", title: "Khám sàng lọc trước tiêm", text: "Bác sĩ khám và chỉ định trước mỗi mũi tiêm theo quy trình." },
    { icon: "shield", title: "Vắc xin chính hãng", text: "Nguồn gốc rõ ràng, bảo quản theo chuẩn." },
    { icon: "timer", title: "Theo dõi sau tiêm", text: "Ở lại theo dõi tại trung tâm và được hướng dẫn chăm sóc tại nhà." },
    { icon: "reminder", title: "Nhắc lịch tiêm", text: "Nhắc trước ngày hẹn để không bỏ lỡ mũi tiêm." },
  ],
  numbers: [
    { value: "23", label: "loại vắc xin" },
    { value: "10", label: "gói vắc xin" },
    { value: "4", label: "bác sĩ" },
    { value: "1", label: "trung tâm tại Quy Nhơn" },
  ],
};
