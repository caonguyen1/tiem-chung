import {
  CalendarCheck,
  MessageCircle,
  Newspaper,
  Package,
  Syringe,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  AdminCard,
  AdminPageHeader,
  appointmentStatus,
  consultStatus,
  formatDateTime,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { db, schema } from "@/db";
import { verifyPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { count, desc, eq } from "drizzle-orm";

export const metadata: Metadata = { title: "Tổng quan" };

/** Dashboard: what needs attention today, plus the size of the catalogue. Data is read live. */
export default async function AdminDashboard() {
  const admin = await requireAdmin();
  // The seed account starts with the password from .env.example; nag until it is changed.
  const [account] = await db.select({ hash: schema.adminUsers.passwordHash }).from(schema.adminUsers).where(eq(schema.adminUsers.id, admin.id));
  const defaultPassword = await verifyPassword("change-me-please", account?.hash);
  const [
    [newAppointments],
    [newConsults],
    [vaccines],
    [packages],
    [articles],
    recentAppointments,
    recentConsults,
  ] = await Promise.all([
    db
      .select({ n: count() })
      .from(schema.appointments)
      .where(eq(schema.appointments.status, "new")),
    db
      .select({ n: count() })
      .from(schema.consultRequests)
      .where(eq(schema.consultRequests.status, "new")),
    db.select({ n: count() }).from(schema.vaccines),
    db.select({ n: count() }).from(schema.vaccinePackages),
    db.select({ n: count() }).from(schema.articles),
    db
      .select()
      .from(schema.appointments)
      .orderBy(desc(schema.appointments.createdAt))
      .limit(6),
    db
      .select()
      .from(schema.consultRequests)
      .orderBy(desc(schema.consultRequests.createdAt))
      .limit(6),
  ]);

  const stats = [
    {
      label: "Lịch hẹn mới",
      value: newAppointments.n,
      href: "/admin/lich-hen",
      Icon: CalendarCheck,
      hot: true,
    },
    {
      label: "Yêu cầu tư vấn mới",
      value: newConsults.n,
      href: "/admin/tu-van",
      Icon: MessageCircle,
      hot: true,
    },
    {
      label: "Vắc xin",
      value: vaccines.n,
      href: "/admin/vac-xin",
      Icon: Syringe,
    },
    {
      label: "Gói vắc xin",
      value: packages.n,
      href: "/admin/goi-vac-xin",
      Icon: Package,
    },
    {
      label: "Bài viết",
      value: articles.n,
      href: "/admin/bai-viet",
      Icon: Newspaper,
    },
  ];

  return (
    <>
      {defaultPassword && (
        <p role="alert" className="mb-4 rounded-xl bg-warn-soft px-4 py-3 text-[15px] font-bold text-warn">
          Bạn đang dùng mật khẩu mặc định.{" "}
          <Link href="/admin/mat-khau" className="underline">
            Đổi mật khẩu ngay
          </Link>
        </p>
      )}
      <AdminPageHeader
        title={`Xin chào, ${admin.name}`}
        description="Những việc cần xử lý hôm nay và số liệu nội dung của website."
      />

      <ul className="grid grid-cols-2 gap-3 desk:grid-cols-5 desk:gap-4">
        {stats.map(({ label, value, href, Icon, hot }) => (
          <li key={label}>
            <Link
              href={href}
              className="block h-full rounded-box bg-white p-4 ring-1 ring-line ring-inset transition hover:ring-brand-bright"
            >
              <span
                className={`grid size-10 place-items-center rounded-full ${hot && value > 0 ? "bg-sun-100 text-sun-600" : "bg-brand-50 text-brand-600"}`}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <b className="mt-3 block text-[30px] leading-none text-brand-800">
                {value}
              </b>
              <span className="mt-1 block text-[13.5px] text-subtle">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-4 desk:grid-cols-2 desk:gap-5">
        <AdminCard
          title="Lịch hẹn mới nhất"
          action={
            <Link
              href="/admin/lich-hen"
              className="text-sm font-bold text-link"
            >
              Xem tất cả
            </Link>
          }
        >
          {recentAppointments.length === 0 ? (
            <Empty text="Chưa có lịch hẹn nào." />
          ) : (
            <ul className="divide-y divide-line">
              {recentAppointments.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 tab:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-brand-800">
                      {item.fullName}
                    </p>
                    <p className="truncate text-[13px] text-subtle">
                      {item.phone}
                      {item.itemSlug && ` · ${item.itemSlug}`} ·{" "}
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge tone={appointmentStatus[item.status].tone}>
                    {appointmentStatus[item.status].label}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard
          title="Yêu cầu tư vấn mới nhất"
          action={
            <Link href="/admin/tu-van" className="text-sm font-bold text-link">
              Xem tất cả
            </Link>
          }
        >
          {recentConsults.length === 0 ? (
            <Empty text="Chưa có yêu cầu tư vấn nào." />
          ) : (
            <ul className="divide-y divide-line">
              {recentConsults.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 tab:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-brand-800">
                      {item.fullName}
                    </p>
                    <p className="truncate text-[13px] text-subtle">
                      {item.phone}
                      {item.topic && ` · ${item.topic}`} ·{" "}
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge tone={consultStatus[item.status].tone}>
                    {consultStatus[item.status].label}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="px-5 py-10 text-center text-[15px] text-subtle">{text}</p>
  );
}
