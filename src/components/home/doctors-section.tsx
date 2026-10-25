import { Quote } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";

import type { Doctor } from "@/content/types";

import { SectionHeading } from "../ui/section-heading";

export function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  const [lead, ...team] = doctors;

  return (
    <section className="py-12 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Đội ngũ chuyên môn"
          title="Bác sĩ Sản – Nhi đồng hành cùng mẹ và bé"
          action={{ label: "Xem đội ngũ", href: "/doi-ngu-chuyen-mon" }}
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <article className="relative grid overflow-hidden rounded-[var(--radius-card)] bg-brand-50 sm:grid-cols-[0.9fr_1fr]">
            <div className="relative aspect-[4/4.2] sm:aspect-auto">
              {lead.photo && (
                <Image
                  src={lead.photo}
                  alt={`${lead.title} ${lead.name}`}
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-7 lg:p-9">
              <Quote className="size-9 fill-sun-400 text-sun-400" />
              <p className="mt-4 text-xl leading-snug font-semibold text-brand-800 text-pretty lg:text-2xl">“{lead.quote}”</p>
              <div className="mt-6 border-t border-brand-200 pt-5">
                <p className="text-[13px] font-medium text-brand-500">{lead.title}</p>
                <p className="text-lg font-bold text-brand-800">{lead.name}</p>
                <p className="text-[14px] text-muted">{lead.specialty}</p>
              </div>
            </div>
          </article>

          <ul className="grid gap-4">
            {team.map((doctor) => (
              <li key={doctor.slug}>
                <AppLink
                  href={`/doi-ngu-chuyen-mon/${doctor.slug}`}
                  className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-4 transition hover:border-brand-200 hover:shadow-card"
                >
                  <DoctorAvatar doctor={doctor} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-brand-500">{doctor.title}</p>
                    <p className="text-[17px] font-bold text-brand-800">{doctor.name}</p>
                    <p className="text-[14px] text-muted">{doctor.specialty}</p>
                  </div>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Falls back to brand-coloured initials until the admin uploads a portrait. */
function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  if (doctor.photo) {
    return (
      <Image src={doctor.photo} alt="" width={72} height={72} className="size-18 shrink-0 rounded-2xl object-cover object-top" />
    );
  }
  const initials = doctor.name
    .split(" ")
    .slice(-2)
    .map((part) => part[0])
    .join("");
  return (
    <span className="relative grid size-18 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand-600 text-xl font-bold text-white">
      <span className="absolute inset-x-0 bottom-0 h-1.5 bg-sun-400" />
      {initials}
    </span>
  );
}
