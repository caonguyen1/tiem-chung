import { asc, count, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, ListToolbar, PAGE_SIZE, Pagination, listParams, RowActions } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deleteAccount, toggleAccount } from "@/lib/actions/admin/accounts";
import { vnDateTime } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Tài khoản quản trị" };

export default async function AccountsAdminPage({ searchParams }: PageProps<"/admin/tai-khoan">) {
  const me = await requireAdmin(["admin"]);
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.adminUsers.name, `%${q}%`), ilike(schema.adminUsers.email, `%${q}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select().from(schema.adminUsers).where(where).orderBy(asc(schema.adminUsers.createdAt)).limit(PAGE_SIZE).offset(offset),
    db.select({ n: count() }).from(schema.adminUsers).where(where),
  ]);

  return (
    <>
      <AdminPageHeader title="Tài khoản quản trị" description="Người được đăng nhập vào trang quản trị. Quản trị viên làm được mọi việc; biên tập viên quản lý nội dung, lịch hẹn và tư vấn nhưng không quản lý tài khoản." />
      <ListToolbar query={q} placeholder="Tìm theo tên hoặc email" addHref="/admin/tai-khoan/moi" addLabel="Thêm tài khoản" />
      <ListTable columns={[{ label: "Tài khoản" }, { label: "Trạng thái", className: "w-32" }, { label: "", className: "w-32" }]} empty={rows.length === 0 && <EmptyList text={q ? "Không tìm thấy tài khoản nào." : "Chưa có tài khoản."} />}>
        {rows.map((user) => {
          const self = user.id === me.id;
          return (
            <li key={user.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5">
              <div className="min-w-0 flex-1 basis-60">
                <p className="flex flex-wrap items-center gap-2 font-bold text-brand-800">
                  {user.name}
                  <StatusBadge tone={user.role === "admin" ? "progress" : "muted"}>{user.role === "admin" ? "Quản trị viên" : "Biên tập viên"}</StatusBadge>
                  {self && <StatusBadge tone="new">Bạn</StatusBadge>}
                </p>
                <p className="truncate text-[13px] text-subtle">
                  {user.email} · {user.lastLoginAt ? `đăng nhập gần nhất ${vnDateTime(user.lastLoginAt)}` : "chưa đăng nhập lần nào"}
                </p>
              </div>
              <div className="w-32">{user.isActive ? <StatusBadge tone="done">Hoạt động</StatusBadge> : <StatusBadge tone="warn">Đã khóa</StatusBadge>}</div>
              <div className="w-32">
                <RowActions
                  id={user.id}
                  editHref={`/admin/tai-khoan/${user.id}`}
                  visible={user.isActive}
                  onToggle={self ? undefined : toggleAccount}
                  onDelete={deleteAccount}
                  deleteMessage={`Xóa tài khoản "${user.name}" (${user.email})? Không thể hoàn tác.`}
                  deleteBlocked={self ? "Không thể xóa chính mình" : undefined}
                />
              </div>
            </li>
          );
        })}
      </ListTable>
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/tai-khoan?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
