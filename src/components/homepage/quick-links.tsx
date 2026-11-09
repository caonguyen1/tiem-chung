import { BOOKING_HASH, CONSULT_HASH } from "@/lib/routes";

import { BrandIconByName, type BrandIconName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";

const links: { icon: BrandIconName; title: string; text: string; href: string; tone: "bright" | "deep" | "white" }[] = [
  { icon: "syringe", title: "Tra cứu vắc xin", text: "Theo bệnh, tên vắc xin", href: "#tra-cuu-vac-xin", tone: "bright" },
  { icon: "calendar", title: "Đặt lịch tiêm", text: "Xác nhận qua điện thoại", href: BOOKING_HASH, tone: "deep" },
  { icon: "doctorChat", title: "Tư vấn", text: "Bác sĩ gọi lại cho bạn", href: CONSULT_HASH, tone: "white" },
];

const tones = {
  bright: "dots-overlay bg-linear-135 from-brand-bright to-brand-600 to-75% text-white",
  deep: "dots-overlay bg-linear-135 from-brand-500 to-brand-800 to-80% text-white",
  white: "bg-white text-brand-800 ring-1 ring-line ring-inset",
};

/** Three shortcuts (the client dropped "Gói vắc xin", 2026-11-01): 3 across on every screen. */
export function QuickLinks() {
  return (
    <section className="pt-3 pb-6 tab:py-6 desk:py-8">
      <div className="container-site grid grid-cols-3 gap-2 tab:gap-2.5 desk:gap-4">
        {links.map((link) => (
          <AppLink
            key={link.title}
            href={link.href}
            className={`relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[10px] px-1.5 py-3 text-center tab:min-h-[88px] tab:flex-row tab:justify-start tab:gap-2.5 tab:p-3.5 tab:text-left desk:min-h-[108px] desk:gap-3.5 desk:rounded-xl desk:p-5 ${tones[link.tone]}`}
          >
            <BrandIconByName name={link.icon} disc={link.tone === "white" ? "soft" : "white"} className="size-10 shrink-0 tab:size-[46px] desk:size-[60px]" />
            <span>
              <b className="block text-[13px] leading-tight tab:text-base desk:text-[18.5px]">{link.title}</b>
              <span className={`hidden text-[13.5px] tab:block ${link.tone === "white" ? "text-subtle" : "opacity-90"}`}>{link.text}</span>
            </span>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
