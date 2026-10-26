// Sample rules for "Tôi nên tiêm gì?" (admin module 4: age range × gender →
// vaccines and packages). The doctor confirms everything at the screening visit.

export type Gender = "nu" | "nam";

export type AgeRange = { value: string; label: string };

export const ageRanges: AgeRange[] = [
  { value: "0-6-thang", label: "0 – 6 tháng" },
  { value: "6-24-thang", label: "6 – 24 tháng" },
  { value: "2-9-tuoi", label: "2 – 9 tuổi" },
  { value: "9-18-tuoi", label: "9 – 18 tuổi" },
  { value: "18-45-tuoi", label: "18 – 45 tuổi" },
  { value: "tren-45-tuoi", label: "Trên 45 tuổi" },
];

export const genders: { value: Gender; label: string }[] = [
  { value: "nu", label: "Nữ" },
  { value: "nam", label: "Nam" },
];

type Rule = { vaccineSlugs: string[]; packageSlug: string };

const rules: Record<string, Partial<Record<Gender, Rule>> & { all?: Rule }> = {
  "0-6-thang": { all: { vaccineSlugs: ["hexaxim", "rotateq", "synflorix"], packageSlug: "goi-0-6-thang" } },
  "6-24-thang": { all: { vaccineSlugs: ["vaxigrip-tetra", "mmr-ii", "imojev", "havrix"], packageSlug: "goi-0-24-thang" } },
  "2-9-tuoi": { all: { vaccineSlugs: ["vaxigrip-tetra", "qdenga", "vac-xin-tay-chan-mieng", "twinrix"], packageSlug: "goi-tien-hoc-duong" } },
  "9-18-tuoi": { all: { vaccineSlugs: ["gardasil-9", "vaxigrip-tetra", "qdenga", "twinrix"], packageSlug: "goi-thanh-thieu-nien" } },
  "18-45-tuoi": {
    nu: { vaccineSlugs: ["gardasil-9", "mmr-ii", "vaxigrip-tetra", "twinrix"], packageSlug: "goi-truoc-mang-thai" },
    nam: { vaccineSlugs: ["gardasil-9", "vaxigrip-tetra", "twinrix", "qdenga"], packageSlug: "goi-nguoi-truong-thanh" },
  },
  "tren-45-tuoi": { all: { vaccineSlugs: ["vaxigrip-tetra", "prevenar-20", "abrysvo", "twinrix"], packageSlug: "goi-benh-man-tinh" } },
};

export function recommendFor(age: string, gender: Gender): Rule {
  const rule = rules[age];
  return rule?.[gender] ?? rule?.all ?? { vaccineSlugs: [], packageSlug: "" };
}
