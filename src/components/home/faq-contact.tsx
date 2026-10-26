import { ChevronDown, Clock, MapPin, MessagesSquare, Navigation, Phone } from "lucide-react";

import { centers } from "@/content/editorial";
import { faqs, siteSettings } from "@/content/site";
import { BOOKING_HASH } from "@/lib/routes";

import { LocationIcon } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";
import { SectionHeading } from "../ui/section-heading";

/** Câu hỏi thường gặp + where to find and reach the center. */
export function FaqContact() {
  const [center] = centers;

  return (
    <section id="lien-he" className="scroll-mt-20 py-12 lg:scroll-mt-24 lg:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <SectionHeading eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" />
          <div className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
            {faqs.map((faq, index) => (
              <details key={faq.question} name="faq" open={index === 0} className="group px-4 md:px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold text-brand-800 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 text-brand-400 transition group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-[15px] leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Liên hệ" title="Đến Tâm Trí tiêm chủng" />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
            {center.mapEmbedUrl ? (
              <iframe
                src={center.mapEmbedUrl}
                title={`Bản đồ đến ${center.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[16/9] w-full border-0 bg-brand-50"
              />
            ) : (
              <MapPlaceholder address={center.address} mapUrl={center.mapUrl} />
            )}
            <div className="p-4 md:p-5">
              <h3 className="text-[18px] font-bold text-brand-800">{center.name}</h3>
              <ul className="mt-3 space-y-2.5 text-[15px] text-muted">
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  {center.address}
                </li>
                <li className="flex gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  {center.openingHours}
                </li>
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  <span>
                    Tổng đài <strong className="text-ink">{siteSettings.hotline.display}</strong> ({siteSettings.hotline.note}) ·{" "}
                    {siteSettings.phone.display}
                  </span>
                </li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <ButtonLink href={BOOKING_HASH} className="col-span-2 h-12">
                  Đặt lịch tiêm
                </ButtonLink>
                <ButtonLink href={`tel:${siteSettings.hotline.dial}`} variant="outline" className="h-11 px-3 text-[14px]">
                  <Phone className="size-4" />
                  Gọi {siteSettings.hotline.display}
                </ButtonLink>
                <ButtonLink href={siteSettings.zaloUrl} variant="outline" className="h-11 px-3 text-[14px]">
                  <MessagesSquare className="size-4" />
                  Chat Zalo
                </ButtonLink>
                <ButtonLink href={center.mapUrl} variant="ghost" className="col-span-2 h-10 text-[14px]">
                  <Navigation className="size-4" />
                  Chỉ đường bằng Google Maps
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shown until the center's own Google Maps listing can be embedded. */
function MapPlaceholder({ address, mapUrl }: { address: string; mapUrl: string }) {
  return (
    <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-brand-50">
      <svg aria-hidden="true" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g stroke="#ffffff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-10 160 420 90" />
          <path d="M120 -10 170 240" />
          <path d="M290 -10 250 240" />
        </g>
        <g stroke="#c5cfec" strokeWidth="3" fill="none">
          <path d="M-10 60 420 20" />
          <path d="M40 -10 60 240" />
          <path d="M-10 210 420 170" />
          <path d="M350 -10 340 240" />
        </g>
        <path d="M200 240C230 150 300 100 420 80" stroke="#FADC00" strokeWidth="6" fill="none" />
      </svg>
      <div className="relative flex flex-col items-center px-6 text-center">
        <LocationIcon className="size-16 drop-shadow" />
        <p className="mt-2 max-w-xs text-[14px] font-semibold text-brand-800">{address}</p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-brand-700 shadow-card hover:bg-brand-50"
        >
          Mở Google Maps
        </a>
      </div>
    </div>
  );
}
