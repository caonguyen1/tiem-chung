import { ArrowRight } from "lucide-react";

import { whyChooseUs } from "@/content/site";

import { BrandIconByName } from "../icons/brand-icons";
import { AppLink } from "../ui/app-link";

/** "Vì sao chọn Tâm Trí": one compact row of four commitments. */
export function WhyTamTri() {
  return (
    <section aria-labelledby="why-title" className="pb-12 lg:pb-20">
      <div className="container-page">
        <div className="rounded-[var(--radius-card)] bg-brand-700 px-4 py-6 md:px-8 md:py-8">
          <h2 id="why-title" className="text-center text-[22px] font-bold text-white md:text-[26px]">
            Vì sao chọn <span className="text-sun-400">Tâm Trí</span>?
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 md:mt-7 lg:grid-cols-4 lg:gap-6">
            {whyChooseUs.map((item) => (
              <li key={item.title} className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-4 lg:text-left">
                <BrandIconByName name={item.icon} className="size-14 shrink-0 lg:size-16" />
                <div className="mt-2 lg:mt-0">
                  <h3 className="text-[15px] leading-snug font-bold text-white md:text-[17px]">{item.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-brand-100 md:text-[14px]">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center">
            <AppLink href="/doi-ngu-chuyen-mon" className="inline-flex items-center gap-1 text-[14px] font-semibold text-sun-300 hover:text-sun-200">
              Tìm hiểu đội ngũ chuyên môn
              <ArrowRight className="size-3.5" />
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  );
}
