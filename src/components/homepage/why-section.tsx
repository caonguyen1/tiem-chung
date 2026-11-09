import { whyChooseUs } from "@/content/site";

import { BrandIconByName } from "../icons/brand-icons";
import { ButtonLink } from "../ui/button-link";

/** "Vì sao gia đình chọn Tâm Trí?": the four commitments with a link to the medical team. */
export function WhySection() {
  return (
    <section className="py-4 tab:py-6 desk:py-8">
      <div className="container-site">
        <div className="grid gap-3 rounded-box bg-white p-4 tab:gap-5 tab:p-6 desk:grid-cols-[360px_1fr] desk:items-center desk:gap-8 desk:p-9">
          <div>
            <h2 className="text-xl leading-tight font-bold text-brand-800 tab:text-[28px] desk:text-[34px]">Vì sao gia đình chọn Tâm Trí?</h2>
            <p className="mt-1.5 text-[13px] text-subtle tab:mt-2.5 tab:text-base">Cùng hệ thống Phòng khám Sản – Nhi và Nhà thuốc Tâm Trí.</p>
            <ButtonLink href="/doi-ngu-chuyen-mon" className="mt-3 desk:mt-[22px]">
              Tìm hiểu đội ngũ chuyên môn
            </ButtonLink>
          </div>
          <ul className="grid grid-cols-2 gap-2 tab:gap-2.5 desk:grid-cols-4 desk:gap-3.5">
            {whyChooseUs.map((item) => (
              <li key={item.title} className="rounded-xl bg-surface-soft p-3 tab:px-3.5 tab:py-4 desk:px-[18px] desk:py-[22px]">
                <BrandIconByName name={item.icon} className="size-10 tab:size-11 desk:size-14" />
                <h3 className="mt-1.5 text-sm font-bold text-brand-800 tab:mt-2 tab:text-[15px] desk:mt-3.5 desk:text-[17px]">{item.title}</h3>
                <p className="mt-1 hidden text-sm leading-snug text-body tab:block">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
