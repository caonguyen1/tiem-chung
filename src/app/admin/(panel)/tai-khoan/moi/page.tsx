import type { Metadata } from "next";

import { AccountForm } from "@/components/admin/account-forms";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm tài khoản" };

export default async function NewAccountPage() {
  await requireAdmin(["admin"]);
  return (
    <>
      <AdminPageHeader title="Thêm tài khoản" description="Gửi mật khẩu cho người dùng qua kênh riêng tư; họ nên tự đổi mật khẩu sau lần đăng nhập đầu." />
      <AccountForm />
    </>
  );
}
