import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";

import { siteSettings } from "@/content/site";

const vaccineLinks = [
  { label: "Vắc xin cho trẻ em", href: "/vac-xin?doi-tuong=tre-em" },
  { label: "Vắc xin cho mẹ bầu", href: "/vac-xin?doi-tuong=me-bau" },
  { label: "Vắc xin người lớn", href: "/vac-xin?doi-tuong=nguoi-lon" },
  { label: "Gói vắc xin", href: "/goi-vac-xin" },
  { label: "Bảng giá tiêm chủng", href: "/bang-gia" },
];

export function SiteFooter() {
  // Accounts the admin has not filled in yet are left out.
  const socialLinks = [
    { label: "Facebook", href: siteSettings.facebookUrl },
    { label: "Zalo", href: siteSettings.zaloUrl },
    { label: "YouTube", href: siteSettings.youtubeUrl },
  ].filter((social) => social.href);

  return (
    <footer className="relative mt-auto overflow-hidden bg-brand-900 text-brand-100">
      <div className="brand-stripe h-3" />
      <div className="container-page grid gap-8 py-10 md:grid-cols-2 md:gap-10 md:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo-horizontal-white.png"
            alt={siteSettings.name}
            width={900}
            height={299}
            className="h-14 w-auto"
          />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-brand-200">{siteSettings.description}</p>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sun-400" />
              {siteSettings.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sun-400" />
              <span>
                Tổng đài <strong className="text-white">{siteSettings.hotline.display}</strong> · {siteSettings.phone.display}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sun-400" />
              {siteSettings.email}
            </li>
          </ul>
        </div>

        <FooterColumn title="Về Tâm Trí" links={[...siteSettings.mainMenu.slice(3), ...siteSettings.secondaryMenu.slice(0, 2)]} />
        <FooterColumn title="Vắc xin" links={vaccineLinks} />
        <FooterColumn title="Chính sách" links={siteSettings.policyMenu} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-[13px] text-brand-300 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {siteSettings.name}. Thông tin trên website chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <AppLink key={social.label} href={social.href} className="hover:text-white">
                {social.label}
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <AppLink href={link.href} className="text-brand-200 transition hover:text-sun-300">
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
