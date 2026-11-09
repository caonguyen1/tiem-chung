import { Clock, MapPin, Phone } from "lucide-react";

import type { Center } from "@/content/types";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

/** A vaccination center: name, address, hours and phone, with a link to its page and to the map. */
export function CenterCard({ center }: { center: Center }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 tab:p-5">
      <h3 className="text-lg font-bold text-brand-800 desk:text-xl">{center.name}</h3>
      <ul className="mt-2.5 grid gap-2 text-[14px] text-body tab:text-[15px]">
        <li className="flex gap-2.5">
          <MapPin aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-brand-600" />
          {center.address}
        </li>
        <li className="flex gap-2.5">
          <Clock aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-brand-600" />
          {center.openingHours}
        </li>
        {center.phone && (
          <li className="flex gap-2.5">
            <Phone aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-brand-600" />
            <AppLink href={`tel:${center.phone.replace(/\s/g, "")}`} className="font-bold text-link">
              {center.phone}
            </AppLink>
          </li>
        )}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <ButtonLink href={`/he-thong-trung-tam/${center.slug}`} variant="secondary" size="sm">
          Chi tiết
        </ButtonLink>
        <ButtonLink href={center.mapUrl} size="sm">
          Chỉ đường
        </ButtonLink>
      </div>
    </article>
  );
}
