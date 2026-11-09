import type { Metadata } from "next";
import Image from "next/image";

import { BrandIconByName } from "@/components/icons/brand-icons";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { getAbout, getCenters } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";
import { BOOKING_HASH, CONSULT_HASH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Trung tâm Tiêm chủng Tâm Trí thuộc hệ sinh thái y tế Sản – Nhi Tâm Trí tại Quy Nhơn, Gia Lai.",
};

export default async function AboutPage() {
  const [about, settings, centers] = await Promise.all([getAbout(), getSiteSettings(), getCenters()]);
  const image = centers[0]?.image;
  return (
    <main className="flex-1">
      <PageHeader art="about" title={`Giới thiệu ${settings.name}`} description={about.intro} crumbs={[{ label: "Giới thiệu" }]} />

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site grid gap-3 rounded-box bg-white p-4 tab:p-6 desk:grid-cols-2 desk:items-center desk:gap-10 desk:p-9">
          <div className="grid gap-3 text-[15px] leading-relaxed text-body desk:text-base">
            <h2 className="text-xl font-bold text-brand-800 desk:text-[30px]">Câu chuyện của Tâm Trí</h2>
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-bold text-brand-800">{settings.slogan}.</p>
          </div>
          {image && <Image src={image} alt={settings.name} width={1200} height={800} sizes="(min-width: 901px) 560px, 100vw" className="aspect-[3/2] w-full rounded-xl object-cover" />}
        </div>
      </section>

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <ul className="grid grid-cols-2 gap-3 desk:grid-cols-4 desk:gap-4">
            {about.values.map((value) => (
              <li key={value.title} className="rounded-xl border border-line bg-white p-3.5 tab:p-5">
                <BrandIconByName name={value.icon} className="size-12 desk:size-14" />
                <h3 className="mt-2 text-[15px] font-bold text-brand-800 desk:mt-3 desk:text-[17px]">{value.title}</h3>
                <p className="mt-1 text-[13px] leading-snug text-body tab:text-sm">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site">
          <div className="dots-overlay relative grid grid-cols-2 gap-y-5 overflow-hidden rounded-box bg-linear-110 from-brand-800 via-brand-600 to-brand-bright px-4 py-6 text-white desk:grid-cols-4 desk:px-10 desk:py-9">
            {about.numbers.map((item) => (
              <div key={item.label} className="relative z-[1] text-center">
                <b className="block text-[34px] leading-none text-sun-400 desk:text-5xl">{item.value}</b>
                <span className="mt-1 block text-[13px] opacity-90 tab:text-base">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <ButtonLink href="/doi-ngu-chuyen-mon" variant="secondary">
              Đội ngũ chuyên môn
            </ButtonLink>
            <ButtonLink href={CONSULT_HASH} variant="secondary">
              Yêu cầu tư vấn
            </ButtonLink>
            <ButtonLink href={BOOKING_HASH}>Đặt lịch tiêm</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
