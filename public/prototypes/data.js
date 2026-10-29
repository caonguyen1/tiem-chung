// Sample content for the layout drafts, mirroring src/content/*.ts.
const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

const DATA = {
  groups: [
    ["Phế cầu", "lungs"],
    ["6 trong 1", "baby"],
    ["Rotavirus", "rotavirus"],
    ["Cúm", "influenza"],
    ["Sởi – Quai bị", "rash"],
    ["Thủy đậu", "blister"],
    ["HPV", "hpv"],
    ["Sốt xuất huyết", "mosquito"],
  ],
  vaccines: [
    { name: "Prevenar 20", prevents: "Phòng 20 chủng phế cầu gây viêm phổi, viêm màng não", origin: "Bỉ", maker: "Pfizer", price: 1590000 },
    { name: "Vaxneuvance", prevents: "Phòng 15 chủng phế cầu cho trẻ từ 6 tuần tuổi", origin: "Ireland", maker: "MSD", price: 1450000 },
    { name: "Prevenar 13", prevents: "Phòng 13 chủng phế cầu, dùng cho trẻ và người lớn", origin: "Bỉ", maker: "Pfizer", price: 1280000 },
    { name: "Synflorix", prevents: "Phòng phế cầu và viêm tai giữa cho trẻ dưới 5 tuổi", origin: "Bỉ", maker: "GSK", price: 1045000 },
  ],
  packages: [
    { name: "Gói cho bé 0–6 tháng", who: "0 – 6 tháng", icon: "baby", doses: 12, count: 6, price: 11890000, was: 12980000, hot: true },
    { name: "Gói cho bé 0–12 tháng", who: "0 – 12 tháng", icon: "baby", doses: 18, count: 9, price: 18450000, was: 20110000 },
    { name: "Gói tiền học đường", who: "3 – 9 tuổi", icon: "rash", doses: 8, count: 7, price: 7950000, was: 8640000 },
    { name: "Gói thanh thiếu niên", who: "9 – 18 tuổi", icon: "hpv", doses: 7, count: 6, price: 12480000, was: 13560000 },
  ],
  why: [
    ["stethoscope", "Bác sĩ khám sàng lọc", "Khám sàng lọc, tư vấn trước tiêm theo quy trình chuyên môn."],
    ["shield", "Vắc xin rõ nguồn gốc", "Nguồn gốc, điều kiện bảo quản được kiểm soát."],
    ["timer", "Theo dõi sau tiêm", "Theo dõi tại cơ sở theo thời gian và quy trình chuyên môn."],
    ["reminder", "Nhắc lịch tiêm", "Hỗ trợ nhắc lịch các mũi tiếp theo."],
  ],
  articles: [
    { title: "Những phản ứng thường gặp sau tiêm và cách chăm sóc tại nhà", excerpt: "Sốt nhẹ, sưng đau chỗ tiêm có đáng lo? Cách chăm sóc bé trong 24–48 giờ đầu và khi nào cần quay lại cơ sở y tế.", img: "../images/interior-waiting.jpg", tag: "Nhi", date: "18/10/2026" },
    { title: "Khám sàng lọc trước tiêm chủng: những thông tin ba mẹ cần biết", img: "../images/interior-exam-room.jpg", tag: "Mẹ & Bé", date: "20/10/2026" },
    { title: "Lịch tiêm chủng cho bé từ 0 đến 24 tháng ba mẹ cần nắm", img: "../images/family.jpg", tag: "Mẹ & Bé", date: "08/10/2026" },
    { title: "Chuẩn bị mang thai: nên tiêm những vắc xin nào và trước bao lâu?", img: "../images/interior-reception.jpg", tag: "Sức khỏe giới tính", date: "15/10/2026" },
  ],
  faqs: [
    "Trẻ cần chuẩn bị gì trước khi đi tiêm?",
    "Có cần đặt lịch trước khi đến tiêm không?",
    "Sau tiêm bao lâu thì được ra về?",
    "Tôi có thể tiêm nhiều loại vắc xin trong một lần không?",
    "Trung tâm có nhắc lịch mũi tiếp theo không?",
  ],
  nav: ["Vắc xin", "Gói vắc xin", "Tôi nên tiêm gì?", "Kiến thức", "Về chúng tôi"],
  phone: "0593 888 666",
  address: "424 Nguyễn Thị Minh Khai, P. Quy Nhơn Nam, T. Gia Lai",
  hours: "7:30 – 20:00 hằng ngày",
};

// Small UI glyphs (lucide shapes) used inline.
const UI = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};

// Renders each <template data-each="key"> once per DATA[key] item.
// Inside a template, {{expr}} is evaluated with the item as `it` and its index as `i`.
function renderTemplates() {
  document.querySelectorAll("template[data-each]").forEach((tpl) => {
    const items = DATA[tpl.dataset.each];
    const limit = Number(tpl.dataset.limit || items.length);
    const from = Number(tpl.dataset.from || 0);
    const html = items
      .slice(from, from + limit)
      .map((it, i) => tpl.innerHTML.replace(/\{\{(.+?)\}\}/g, (_, expr) => new Function("it", "i", "vnd", "UI", "DATA", `return (${expr})`)(it, i + from, vnd, UI, DATA)))
      .join("");
    tpl.insertAdjacentHTML("beforebegin", html);
    tpl.remove();
  });
  document.querySelectorAll("[data-ui]").forEach((el) => (el.innerHTML = UI[el.dataset.ui]));
}
