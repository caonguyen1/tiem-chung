import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

import { OwnPasswordForm } from "@/components/admin/account-forms";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đổi mật khẩu" };

/** Every signed-in account (admin or editor) changes its own password here. */
export default async function OwnPasswordPage({ searchParams }: PageProps<"/admin/mat-khau">) {
  await requireAdmin();
  const done = (await searchParams)["da-doi"] === "1";
  return (
    <>
      <AdminPageHeader title="Đổi mật khẩu" description="Dùng mật khẩu dài, riêng cho trang quản trị." />
      {done && (
        <p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-surface-deep px-4 py-3 text-[15px] font-bold text-brand-800">
          <CheckCircle2 aria-hidden="true" className="size-5 text-brand-600" />
          Đã đổi mật khẩu. Các thiết bị khác của bạn đã được đăng xuất.
        </p>
      )}
      <OwnPasswordForm />
    </>
  );
}
