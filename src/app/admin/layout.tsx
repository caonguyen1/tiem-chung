import type { Metadata } from "next";
import type { ReactNode } from "react";

// The admin is never indexed, whatever SITE_INDEXABLE says (robots.ts also blocks /admin).
export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị Tâm Trí" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
