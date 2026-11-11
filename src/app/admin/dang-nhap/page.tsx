import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-linear-to-b from-white to-surface px-4 py-10">
      <div className="w-full max-w-[420px]">
        <Image src="/images/logo-horizontal.png" alt="Trung tâm Tiêm chủng Tâm Trí" width={900} height={299} priority className="mx-auto h-14 w-auto" />
        <div className="mt-6 rounded-box bg-white p-6 ring-1 ring-line ring-inset tab:p-8">
          <h1 className="text-2xl font-bold text-brand-800">Đăng nhập quản trị</h1>
          <p className="mt-1 mb-5 text-[15px] text-subtle">Dành cho nhân viên Trung tâm Tiêm chủng Tâm Trí.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
