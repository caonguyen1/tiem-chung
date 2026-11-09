import type { SiteSettings } from "@/content/types";

import { AppLink } from "../ui/app-link";

const paths: Record<SiteSettings["social"][number]["network"], React.ReactNode> = {
  facebook: <path fill="currentColor" d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.3-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7V11H8.2v2.8h2.4V21Z" />,
  zalo: (
    <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="currentColor">
      Zalo
    </text>
  ),
  tiktok: <path fill="currentColor" d="M15.6 4c.3 2 1.6 3.4 3.6 3.6v2.7c-1.3 0-2.5-.4-3.6-1.1v5.4a5 5 0 1 1-5-5h.5v2.8h-.5a2.2 2.2 0 1 0 2.2 2.2V4Z" />,
  youtube: (
    <path
      fill="currentColor"
      d="M21.2 8.1c-.2-.9-.9-1.5-1.8-1.7C17.8 6 12 6 12 6s-5.8 0-7.4.4c-.9.2-1.6.8-1.8 1.7C2.4 9.6 2.4 12 2.4 12s0 2.4.4 3.9c.2.9.9 1.5 1.8 1.7 1.6.4 7.4.4 7.4.4s5.8 0 7.4-.4c.9-.2 1.6-.8 1.8-1.7.4-1.5.4-3.9.4-3.9s0-2.4-.4-3.9ZM10.2 14.6V9.4l4.6 2.6Z"
    />
  ),
};

/** Round social icons. An account without a link yet shows the icon but is not clickable. */
export function SocialLinks({ items, tone = "light" }: { items: SiteSettings["social"]; tone?: "light" | "dark" }) {
  const circle = tone === "dark" ? "bg-white/12 text-white" : "bg-brand-600 text-white";
  return (
    <ul className="flex gap-2.5">
      {items.map((item) => (
        <li key={item.network}>
          <AppLink href={item.href} aria-label={item.label} className={`grid size-9 place-items-center rounded-full desk:size-10 ${circle}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 desk:size-[22px]">
              {paths[item.network]}
            </svg>
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
