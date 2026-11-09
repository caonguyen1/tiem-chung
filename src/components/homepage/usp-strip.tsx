import type { WhyItem } from "@/lib/data/settings";

import { BrandIconByName } from "../icons/brand-icons";

/** The four commitments under the banner (desktop and tablet only; phones see them further down). */
export function UspStrip({ items }: { items: WhyItem[] }) {
  return (
    <ul className="mt-3 hidden grid-cols-2 rounded-xl bg-white p-2 tab:grid desk:mt-5 desk:grid-cols-4 desk:px-2 desk:py-4">
      {items.map((item, index) => (
        <li
          key={item.title}
          className={`flex items-center gap-3 border-line px-2.5 py-2 desk:border-l desk:px-4 desk:py-0 desk:first:border-l-0 ${index % 2 === 1 ? "border-l" : ""}`}
        >
          <BrandIconByName name={item.icon} className="size-10 shrink-0 desk:size-12" />
          <p>
            <b className="block text-[15.5px] text-brand-800">{item.title}</b>
            <span className="text-[13px] leading-snug text-subtle">{item.text}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
