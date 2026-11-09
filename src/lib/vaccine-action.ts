import type { VaccineStatus } from "@/content/types";

import { bookingHref, CONSULT_HASH } from "./routes";

/** The main button on a vaccine card, picked from the vaccine's status (admin module 1). */
export const vaccineAction: Record<VaccineStatus, { label: string; href: (slug: string) => string }> = {
  book: { label: "Đặt lịch", href: (slug) => bookingHref(slug) },
  preorder: { label: "Đặt trước", href: (slug) => bookingHref(slug) },
  consult: { label: "Cần tư vấn", href: () => CONSULT_HASH },
};
