import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import Image from "next/image";

import type { Center } from "@/content/types";

import { ButtonLink } from "../ui/button-link";

type Props = { centers: Center[]; stats: { value: string; label: string }[] };

/** Center count + the flagship center card. */
export function CenterNetwork({ centers, stats }: Props) {
  const [main] = centers;

  return (
    <section className="relative overflow-hidden bg-brand-800 py-12 text-white lg:py-20">
      <svg aria-hidden="true" viewBox="0 0 800 400" className="pointer-events-none absolute -top-24 -left-40 w-[900px] opacity-60">
        <path d="M0 420C80 180 300 40 820 20" stroke="#FADC00" strokeWidth="8" fill="none" />
      </svg>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-sun-300">
            <span className="h-2 w-6 rounded-full bg-sun-400" />
            Hệ thống trung tâm
          </p>
          <h2 className="mt-3 text-[28px] leading-tight font-bold md:text-4xl">
            <span className="text-sun-400">{String(centers.length).padStart(2, "0")}</span> trung tâm tiêm chủng
            <br />
            tại {main.province}
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            Không gian hiện đại, có khu vui chơi cho bé, phòng khám Sản – Nhi và nhà thuốc ngay trong cùng một địa điểm.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end border-l-2 border-sun-400 pl-4">
                <dt className="text-[14px] text-brand-200">{stat.label}</dt>
                <dd className="text-3xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <article className="overflow-hidden rounded-[var(--radius-card)] bg-white text-ink shadow-lift">
          <div className="relative aspect-[16/9]">
            <Image src={main.image} alt={`Mặt tiền ${main.name}`} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
            <span className="absolute top-4 left-4 rounded-full bg-sun-400 px-3 py-1 text-[12px] font-bold text-brand-900">
              Khai trương 08.11.2026
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-brand-800">{main.name}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {main.address}
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {main.openingHours}
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {main.phone}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={main.mapUrl} target="_blank" rel="noopener">
                <Navigation className="size-4" />
                Chỉ đường
              </ButtonLink>
              <ButtonLink href={`/he-thong-trung-tam/${main.slug}`} variant="outline">
                Xem chi tiết
              </ButtonLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
