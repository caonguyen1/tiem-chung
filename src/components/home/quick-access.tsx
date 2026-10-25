import { AppLink } from "@/components/ui/app-link";
import { siteSettings } from "@/content/site";
import type { OutbreakAlert } from "@/content/types";

import { AdvisorIcon, BookIcon, DoctorChatIcon, LocationIcon, SyringeIcon } from "../icons/brand-icons";
import { OutbreakTicker } from "./outbreak-ticker";

const shortcuts = [
  { label: "Tôi nên tiêm gì?", hint: "Gợi ý theo tuổi", href: "/toi-nen-tiem-gi", Icon: AdvisorIcon },
  { label: "Chat với bác sĩ", hint: "Qua Zalo", href: siteSettings.zaloUrl, Icon: DoctorChatIcon },
  { label: "Danh mục vắc xin", hint: "27 nhóm bệnh", href: "/vac-xin", Icon: SyringeIcon },
  { label: "Trung tâm gần tôi", hint: "Chỉ đường", href: "/he-thong-trung-tam", Icon: LocationIcon },
  { label: "Kiến thức tiêm chủng", hint: "Bác sĩ kiểm duyệt", href: "/kien-thuc", Icon: BookIcon },
];

/** Outbreak alerts + the five shortcut tiles, right under the banner. */
export function QuickAccess({ alerts }: { alerts: OutbreakAlert[] }) {
  return (
    <section aria-label="Lối tắt" className="pt-4 md:pt-5">
      <div className="container-page">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card ring-1 ring-line/70">
          <OutbreakTicker alerts={alerts} />

          <ul className="no-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto p-2 sm:grid sm:grid-cols-5 sm:overflow-visible md:p-3">
            {shortcuts.map(({ label, hint, href, Icon }) => (
              <li key={label} className="w-[38%] shrink-0 snap-start sm:w-auto">
                <AppLink
                  href={href}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl px-2 py-4 text-center transition hover:bg-brand-50 lg:flex-row lg:gap-3.5 lg:px-4 lg:text-left"
                >
                  <Icon className="size-14 shrink-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 lg:size-16" />
                  <span>
                    <span className="block text-[15px] leading-snug font-semibold text-brand-800">{label}</span>
                    <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>
                  </span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
