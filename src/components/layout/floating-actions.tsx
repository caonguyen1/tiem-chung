import { CalendarCheck, MessageCircleQuestion, MessagesSquare, Phone } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";

import { siteSettings } from "@/content/site";

/** Desktop: a stack of round buttons on the right. Mobile: a bottom action bar. */
export function FloatingActions() {
  return (
    <>
      <div className="fixed right-5 bottom-6 z-30 hidden flex-col items-end gap-3 lg:flex">
        <a
          href={siteSettings.zaloUrl}
          aria-label="Chat với bác sĩ"
          className="group flex items-center rounded-full bg-white p-1.5 text-sm font-semibold text-brand-700 shadow-lift transition"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:px-3">
            Chat với bác sĩ
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-brand-600 text-white">
            <MessagesSquare className="size-5" />
          </span>
        </a>
        <a
          href={`tel:${siteSettings.hotline.dial}`}
          aria-label={`Gọi tổng đài ${siteSettings.hotline.display}`}
          className="relative grid size-14 place-items-center rounded-full bg-sun-400 text-brand-900 shadow-lift"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-sun-400/50" />
          <Phone className="relative size-6" />
        </a>
      </div>

      <nav
        aria-label="Liên hệ nhanh"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <MobileAction href={`tel:${siteSettings.hotline.dial}`} label="Gọi ngay" icon={<Phone className="size-5" />} />
        <MobileAction href="#tu-van" label="Tư vấn" icon={<MessageCircleQuestion className="size-5" />} />
        <MobileAction href={siteSettings.zaloUrl} label="Chat BS" icon={<MessagesSquare className="size-5" />} />
        <AppLink
          href="/dat-hen"
          className="m-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-600 text-[12px] font-semibold text-white"
        >
          <CalendarCheck className="size-5" />
          Đặt hẹn
        </AppLink>
      </nav>
    </>
  );
}

function MobileAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[12px] font-medium text-brand-700">
      {icon}
      {label}
    </a>
  );
}
