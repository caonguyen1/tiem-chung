"use client";

import {
  CalendarCheck,
  FileText,
  ImageIcon,
  Lightbulb,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Map as MapIcon,
  Menu,
  MessageCircle,
  Newspaper,
  Package,
  Settings2,
  Stethoscope,
  Syringe,
  Tags,
  UserCog,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense, useState } from "react";

import { logout } from "@/lib/actions/auth";
import { type AdminIcon, adminGroups, modulesFor } from "@/lib/admin/modules";
import type { AdminUser } from "@/lib/auth/session";

const icons: Record<AdminIcon, LucideIcon> = {
  syringe: Syringe,
  tags: Tags,
  package: Package,
  lightbulb: Lightbulb,
  calendar: CalendarCheck,
  message: MessageCircle,
  map: MapIcon,
  stethoscope: Stethoscope,
  news: Newspaper,
  image: ImageIcon,
  file: FileText,
  settings: Settings2,
  users: UserCog,
};

const roleLabel = { admin: "Quản trị viên", editor: "Biên tập viên" } as const;

/**
 * Admin frame: navy sidebar with the modules the account may open, top bar with the account
 * and sign-out. Below 901px the sidebar is a drawer, like the public site's menu.
 */
export function AdminShell({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const allowed = new Map(modulesFor(admin.role).map((module) => [module.slug, module]));

  const link = (href: string, label: string, Icon: LucideIcon) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] font-bold transition-colors ${active ? "bg-white/12 text-white before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-sun-400" : "text-brand-100 hover:bg-white/8 hover:text-white"}`}
      >
        <Icon aria-hidden="true" className="size-[18px] shrink-0" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-dvh bg-surface">
      {open && <button type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-brand-900/60 desk:hidden" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col overflow-y-auto bg-brand-800 px-3 py-4 transition-transform duration-200 desk:sticky desk:top-0 desk:h-dvh desk:shrink-0 desk:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2 pb-4">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Image src="/images/logo-horizontal-white.png" alt="Tâm Trí" width={900} height={299} className="h-9 w-auto" />
            <span className="rounded-md bg-sun-400 px-1.5 py-0.5 text-[11px] font-bold text-brand-900">QUẢN TRỊ</span>
          </Link>
          <button type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg text-brand-100 hover:bg-white/10 desk:hidden">
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label="Quản trị" className="grid gap-5">
          <div>{link("/admin", "Tổng quan", LayoutDashboard)}</div>
          {adminGroups.map((group) => {
            const items = group.slugs.flatMap((slug) => (allowed.has(slug) ? [allowed.get(slug)!] : []));
            if (items.length === 0) return null;
            return (
              <div key={group.title}>
                <p className="mb-1.5 px-3 text-[11.5px] font-bold tracking-[0.08em] text-brand-300 uppercase">{group.title}</p>
                <div className="grid gap-0.5">{items.map((module) => link(`/admin/${module.slug}`, module.label, icons[module.icon]))}</div>
              </div>
            );
          })}
        </nav>
        <Link href="/" target="_blank" rel="noopener noreferrer" className="mt-auto px-3 pt-6 text-[13px] text-brand-200 hover:text-white">
          Xem website ↗
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white px-4 tab:px-6">
          <button type="button" aria-label="Mở menu" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 desk:hidden">
            <Menu className="size-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-bold text-brand-800">{admin.name}</p>
              <p className="text-xs text-subtle">{roleLabel[admin.role]}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-brand-600 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
                <LogOut aria-hidden="true" className="size-4" />
                <span className="max-tab:sr-only">Đăng xuất</span>
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 tab:p-6 desk:p-8">
          {/* Pages read live data; the frame stays on screen while a page loads. */}
          <Suspense fallback={<div aria-busy="true" className="h-48 animate-pulse rounded-box bg-white/70" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
