import { Quote } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { RichText } from "@/components/ui/rich-text";
import { getDoctors } from "@/lib/data/content";
import { BOOKING_HASH, CONSULT_HASH } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getDoctors()).map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: PageProps<"/doi-ngu-chuyen-mon/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = (await getDoctors()).find((item) => item.slug === slug);
  return doctor ? { title: `${doctor.title} ${doctor.name}`, description: doctor.specialty } : {};
}

export default async function DoctorPage({ params }: PageProps<"/doi-ngu-chuyen-mon/[slug]">) {
  const { slug } = await params;
  const doctor = (await getDoctors()).find((item) => item.slug === slug);
  if (!doctor) notFound();
  const fullName = `${doctor.title} ${doctor.name}`;

  return (
    <main className="flex-1">
      <PageHeader art="team" title={fullName} description={doctor.specialty} crumbs={[{ label: "Đội ngũ chuyên môn", href: "/doi-ngu-chuyen-mon" }, { label: fullName }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site grid gap-3 desk:grid-cols-[320px_minmax(0,1fr)] desk:items-start desk:gap-6">
          <div className="relative aspect-square overflow-hidden rounded-box bg-linear-160 from-surface-soft to-surface-deep">
            {doctor.photo ? (
              <Image src={doctor.photo} alt={fullName} fill sizes="(min-width: 901px) 320px, 100vw" priority className="object-cover object-top" />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-7xl font-bold text-brand-bright/60">
                {doctor.name.split(" ").slice(-2).map((word) => word.charAt(0)).join("")}
              </span>
            )}
          </div>
          <div className="grid gap-3">
            {doctor.quote && (
              <blockquote className="flex gap-3 rounded-box bg-white p-4 tab:p-6">
                <Quote aria-hidden="true" className="size-7 shrink-0 text-sun-400" fill="currentColor" />
                <p className="text-base font-bold text-brand-800 desk:text-lg">{doctor.quote}</p>
              </blockquote>
            )}
            {doctor.bio && (
              <article className="rounded-box bg-white p-4 tab:p-6 desk:p-7">
                <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Tiểu sử</h2>
                <RichText text={doctor.bio} />
              </article>
            )}
            {doctor.experience && (
              <article className="rounded-box bg-white p-4 tab:p-6 desk:p-7">
                <h2 className="mb-3 text-xl font-bold text-brand-800 desk:text-2xl">Kinh nghiệm</h2>
                <RichText text={doctor.experience.split("\n").map((line) => `- ${line}`).join("\n")} />
              </article>
            )}
            <div className="flex flex-wrap gap-2.5">
              <ButtonLink href={CONSULT_HASH} variant="secondary">
                Yêu cầu tư vấn
              </ButtonLink>
              <ButtonLink href={BOOKING_HASH}>Đặt lịch tiêm</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
