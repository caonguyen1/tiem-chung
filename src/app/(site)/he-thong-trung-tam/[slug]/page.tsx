import { Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button-link";
import { getCenters } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";
import { bookingHref } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getCenters()).map((center) => ({ slug: center.slug }));
}

export async function generateMetadata({ params }: PageProps<"/he-thong-trung-tam/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const center = (await getCenters()).find((item) => item.slug === slug);
  return center ? { title: center.name, description: center.address } : {};
}

export default async function CenterPage({ params }: PageProps<"/he-thong-trung-tam/[slug]">) {
  const { slug } = await params;
  const [centers, settings] = await Promise.all([getCenters(), getSiteSettings()]);
  const center = centers.find((item) => item.slug === slug);
  if (!center) notFound();

  return (
    <main className="flex-1">
      <PageHeader title={center.name} description={center.address} crumbs={[{ label: "Hệ thống trung tâm", href: "/he-thong-trung-tam" }, { label: center.name }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site grid gap-3 desk:grid-cols-[minmax(0,1fr)_420px] desk:items-start desk:gap-5">
          <div className="grid gap-3">
            {center.mapEmbedUrl ? (
              <iframe
                title={`Bản đồ ${center.name}`}
                src={center.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full rounded-box border-0 bg-white desk:aspect-[16/10]"
              />
            ) : (
              center.image && <Image src={center.image} alt={center.name} width={1200} height={800} sizes="(min-width: 901px) 700px, 100vw" className="aspect-[3/2] w-full rounded-box object-cover" />
            )}
          </div>

          <div className="rounded-box bg-white p-4 tab:p-6">
            <h2 className="text-lg font-bold text-brand-800 desk:text-xl">Thông tin liên hệ</h2>
            <dl className="mt-3 grid gap-4 text-[15px]">
              <div className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <dt className="text-sm text-subtle">Địa chỉ (mới)</dt>
                  <dd className="font-bold text-brand-800">{center.address}</dd>
                  {center.addressOld && (
                    <>
                      <dt className="mt-2 text-sm text-subtle">Địa chỉ (cũ, trước khi sáp nhập)</dt>
                      <dd className="text-body">{center.addressOld}</dd>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <dt className="text-sm text-subtle">Giờ hoạt động</dt>
                  <dd className="font-bold text-brand-800">{center.openingHours}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <dt className="text-sm text-subtle">Điện thoại</dt>
                  <dd>
                    <AppLink href={`tel:${center.phone.replace(/\s/g, "")}`} className="font-bold text-link">
                      {center.phone}
                    </AppLink>
                    {settings.hotlineLines.map((line) => (
                      <p key={line.label} className="text-sm text-body">
                        {line.label}:{" "}
                        <AppLink href={`tel:${line.dial}`} className="font-bold text-link">
                          {line.value}
                        </AppLink>
                      </p>
                    ))}
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <ButtonLink href={center.mapUrl} variant="secondary">
                Chỉ đường
              </ButtonLink>
              <ButtonLink href={bookingHref()}>Đặt lịch</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
