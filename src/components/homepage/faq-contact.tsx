import { Clock, MapPin } from "lucide-react";

import { getCenters, getFaqs } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

import { SocialLinks } from "../site/social-links";
import { AppLink } from "../ui/app-link";
import { FaqList } from "../ui/faq-list";
import { SectionTitle } from "../ui/section-title";

const SHOWN = 3;

/**
 * FAQ (three questions, layout C §6) beside the center's details: no building photo,
 * switchboard branches and social links (client feedback 2026-11-03).
 */
export async function FaqContact() {
  const [faqs, centers, settings] = await Promise.all([getFaqs({ homeOnly: true }), getCenters(), getSiteSettings()]);
  const center = centers[0];
  const { hotlineHours, hotlineLines, social, name } = settings;
  return (
    <section id="lien-he" className="scroll-mt-3 py-4 tab:py-6 desk:py-8">
      <div className="container-site grid gap-8 tab:gap-5 desk:grid-cols-[1.15fr_0.85fr] desk:items-start desk:gap-6">
        <div>
          <SectionTitle title="Câu hỏi thường gặp" action={{ label: "Xem thêm câu hỏi", href: "/cau-hoi-thuong-gap" }} />
          <FaqList items={faqs.slice(0, SHOWN)} />
        </div>

        <div className="rounded-box bg-white p-4 ring-1 ring-line ring-inset tab:px-[26px] tab:pt-6 tab:pb-[26px]">
          <h3 className="text-[19px] font-bold text-brand-800 tab:text-[22px]">{name}</h3>
          <ul className="mt-2.5 grid gap-2 text-[13.5px] text-body tab:mt-3 tab:text-[15px]">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-[18px] shrink-0 text-brand-600" />
              {center?.address}
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-[18px] shrink-0 text-brand-600" />
              Mở cửa {center?.openingHours}
            </li>
          </ul>
          <p className="mt-5 text-[13px] font-bold tracking-[0.04em] text-brand-800">TỔNG ĐÀI ({hotlineHours})</p>
          <ul className="mt-2.5 grid gap-2.5">
            {hotlineLines.map((line) => (
              <li key={line.label} className="text-[13.5px] leading-snug text-brand-800 tab:text-[15px]">
                {line.label}
                <AppLink href={`tel:${line.dial}`} className="block font-bold text-link">
                  {line.value}
                </AppLink>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] font-bold tracking-[0.04em] text-brand-800">KẾT NỐI VỚI CHÚNG TÔI</p>
          <div className="mt-2.5">
            <SocialLinks items={social} />
          </div>
        </div>
      </div>
    </section>
  );
}
