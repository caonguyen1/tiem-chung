import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdmin } from "@/lib/auth/session";

/**
 * Everything under /admin except the sign-in page. The session is read at request time, so the
 * check sits in a component behind Suspense (Cache Components); pages below fetch their own
 * data live, inside the same boundary.
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-surface" aria-busy="true" />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/dang-nhap");
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
