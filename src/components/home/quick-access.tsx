import { AppLink } from "@/components/ui/app-link";
import type { OutbreakAlert } from "@/content/types";
import { BOOKING_HASH, CONSULT_HASH } from "@/lib/routes";

import { CalendarIcon, DoctorChatIcon, PackageIcon, SyringeIcon } from "../icons/brand-icons";
import { OutbreakTicker } from "./outbreak-ticker";

// The four jobs the client wants one tap away (feedback 2026-10-26).
const shortcuts = [
  { label: "Tra cứu vắc xin", hint: "Theo bệnh, tên vắc xin", href: "#tra-cuu-vac-xin", Icon: SyringeIcon },
  { label: "Gói vắc xin", hint: "Theo độ tuổi, đối tượng", href: "#goi-vac-xin", Icon: PackageIcon },
  { label: "Đặt lịch tiêm", hint: "Xác nhận qua điện thoại", href: BOOKING_HASH, Icon: CalendarIcon },
  { label: "Tư vấn", hint: "Bác sĩ, chuyên viên gọi lại", href: CONSULT_HASH, Icon: DoctorChatIcon },
];

/** Shortcut tiles + outbreak alerts, right under the banner. */
export function QuickAccess({ alerts }: { alerts: OutbreakAlert[] }) {
  return (
    <section aria-label="Lối tắt" className="pt-3 md:pt-5">
      <div className="container-page">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card ring-1 ring-line/70">
          <ul className="grid grid-cols-4 gap-1 p-2 md:p-3">
            {shortcuts.map(({ label, hint, href, Icon }) => (
              <li key={label}>
                <AppLink
                  href={href}
                  className="group flex h-full flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition hover:bg-brand-50 md:flex-row md:gap-3.5 md:px-4 md:py-4 md:text-left"
                >
                  <Icon className="size-12 shrink-0 transition duration-300 group-hover:scale-105 md:size-14 lg:size-16" />
                  <span>
                    <span className="block text-[13px] leading-tight font-semibold text-brand-800 md:text-[16px]">{label}</span>
                    <span className="mt-0.5 hidden text-[13px] text-muted md:block">{hint}</span>
                  </span>
                </AppLink>
              </li>
            ))}
          </ul>
          <OutbreakTicker alerts={alerts} />
        </div>
      </div>
    </section>
  );
}
