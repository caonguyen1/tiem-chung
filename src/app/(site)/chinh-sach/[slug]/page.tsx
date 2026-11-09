import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/site/page-header";
import { AppLink } from "@/components/ui/app-link";
import { RichText } from "@/components/ui/rich-text";
import { getPolicyPages } from "@/lib/data/content";

export async function generateStaticParams() {
  return (await getPolicyPages()).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chinh-sach/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getPolicyPages()).find((item) => item.slug === slug);
  return page ? { title: page.title } : {};
}

export default async function PolicyPage({ params }: PageProps<"/chinh-sach/[slug]">) {
  const { slug } = await params;
  const pages = await getPolicyPages();
  const page = pages.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <main className="flex-1">
      <PageHeader art="policy" title={page.title} crumbs={[{ label: "Chính sách" }, { label: page.title }]} />
      <section className="py-4 tab:py-6 desk:py-8">
        <div className="container-site grid gap-3 desk:grid-cols-[280px_minmax(0,1fr)] desk:items-start desk:gap-6">
          <nav aria-label="Chính sách" className="rounded-box bg-white p-2 desk:sticky desk:top-4 desk:p-3">
            <ul className="grid">
              {pages.map((item) => (
                <li key={item.slug}>
                  <AppLink
                    href={`/chinh-sach/${item.slug}`}
                    aria-current={item.slug === slug ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-[14.5px] font-bold ${item.slug === slug ? "bg-brand-600 text-white" : "text-brand-800 hover:bg-brand-50"}`}
                  >
                    {item.title}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
          <article className="rounded-box bg-white p-4 tab:p-7 desk:p-10">
            <RichText text={page.body} headingLevel={2} />
          </article>
        </div>
      </section>
    </main>
  );
}
