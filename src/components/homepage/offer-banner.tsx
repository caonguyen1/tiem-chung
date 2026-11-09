import Image from "next/image";

import type { HeroBanner } from "@/content/types";

import { AppLink } from "../ui/app-link";

/**
 * Secondary offer banner: one link, a 3:1 image on desktop and a 9:5 image on phones
 * (the client wants it landscape everywhere). The section fades white to light blue so
 * the curve under "Gói vắc xin" stays visible.
 */
export function OfferBanner({ banner }: { banner: HeroBanner }) {
  return (
    <section className="bg-linear-to-b from-white to-surface pt-4 pb-4 tab:py-6 desk:py-8">
      <div className="container-site">
        <AppLink href={banner.href} className="block overflow-hidden rounded-box">
          <Image src={banner.imageMobile} alt={banner.alt} width={1080} height={600} sizes="100vw" className="aspect-[9/5] w-full object-cover tab:hidden" />
          <Image
            src={banner.imageDesktop}
            alt={banner.alt}
            width={2400}
            height={800}
            sizes="(min-width: 1232px) 1200px, 100vw"
            className="hidden aspect-[3/1] w-full object-cover tab:block"
          />
        </AppLink>
      </div>
    </section>
  );
}
