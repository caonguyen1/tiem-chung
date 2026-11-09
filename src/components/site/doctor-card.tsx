import Image from "next/image";

import type { Doctor } from "@/content/types";

import { AppLink } from "../ui/app-link";

/** Doctor card: portrait (initials until the admin uploads a photo), degree, name and specialty. */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .split(" ")
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("");
  return (
    <AppLink href={`/doi-ngu-chuyen-mon/${doctor.slug}`} className="block h-full overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative aspect-[4/5] bg-linear-160 from-surface-soft to-surface-deep">
        {doctor.photo ? (
          <Image src={doctor.photo} alt={`${doctor.title} ${doctor.name}`} fill sizes="(min-width: 901px) 290px, (min-width: 601px) 45vw, 100vw" className="object-cover object-top" />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-5xl font-bold text-brand-bright/60">
            {initials}
          </span>
        )}
      </div>
      <div className="px-3.5 pt-3 pb-4 desk:px-[18px] desk:pt-4 desk:pb-5">
        <p className="text-xs font-bold text-link desk:text-[13px]">{doctor.title}</p>
        <h3 className="text-base leading-tight font-bold text-brand-800 desk:text-[19px]">{doctor.name}</h3>
        <p className="mt-1 text-[13px] leading-snug text-body desk:text-sm">{doctor.specialty}</p>
      </div>
    </AppLink>
  );
}
