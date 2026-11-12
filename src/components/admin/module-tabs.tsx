import Link from "next/link";

/** Sub-navigation of a module that has several screens (current page is passed in, no hook needed). */
export function ModuleTabs({ tabs, current }: { tabs: { href: string; label: string }[]; current: string }) {
  return (
    <nav aria-label="Mục con" className="mb-5 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={tab.href === current ? "page" : undefined} className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-bold ${tab.href === current ? "bg-brand-600 text-white" : "bg-white text-brand-600 ring-1 ring-line ring-inset hover:bg-brand-50"}`}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export const bannerTabs = [
  { href: "/admin/banner", label: "Banner và popup" },
  { href: "/admin/banner/vi-sao-chon", label: "Khối “Vì sao chọn Tâm Trí”" },
  { href: "/admin/banner/cau-hoi", label: "Câu hỏi thường gặp" },
];

export const settingsTabs = [
  { href: "/admin/cai-dat", label: "Thông tin chung" },
  { href: "/admin/cai-dat/tong-dai", label: "Tổng đài và mạng xã hội" },
  { href: "/admin/cai-dat/menu", label: "Menu" },
];
