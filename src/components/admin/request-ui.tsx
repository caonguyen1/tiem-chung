import { Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const control = "h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-[14.5px] text-brand-800 outline-none focus:border-brand-bright focus:ring-4 focus:ring-brand-100";

/**
 * Filter row of a request list: a plain GET form, so the filters live in the address (and the
 * Excel export can reuse them). `children` are the filter controls.
 */
export function FilterBar({ children, resetHref, exportHref }: { children: ReactNode; resetHref: string; exportHref: string }) {
  return (
    <form role="search" className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] items-end gap-3 rounded-box bg-white p-3 ring-1 ring-line ring-inset tab:p-4">
      {children}
      <div className="col-span-full flex flex-wrap items-center gap-2">
        <button type="submit" className="inline-flex h-11 items-center rounded-full bg-brand-600 px-6 text-[15px] font-bold text-white hover:bg-brand-700">
          Lọc
        </button>
        <Link href={resetHref} className="inline-flex h-11 items-center rounded-full px-4 text-[15px] font-bold text-brand-600 hover:bg-brand-50">
          Xóa lọc
        </Link>
        <a href={exportHref} className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-bold text-brand-600 ring-1 ring-brand-300 ring-inset hover:bg-brand-50">
          <Download aria-hidden="true" className="size-4" />
          Xuất Excel
        </a>
      </div>
    </form>
  );
}

export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-subtle">
      {label}
      {children}
    </label>
  );
}

export const filterControl = control;

type StatusStep = { status: string; label: string; primary?: boolean };

/** Next steps offered on a row for each status (one tap, no detail screen needed). */
export const appointmentSteps: Record<string, StatusStep[]> = {
  new: [
    { status: "confirmed", label: "Xác nhận", primary: true },
    { status: "cancelled", label: "Hủy" },
  ],
  confirmed: [
    { status: "done", label: "Đã tiêm", primary: true },
    { status: "cancelled", label: "Hủy" },
  ],
  done: [{ status: "confirmed", label: "Mở lại" }],
  cancelled: [{ status: "new", label: "Mở lại" }],
};

export const consultSteps: Record<string, StatusStep[]> = {
  new: [{ status: "in_progress", label: "Nhận xử lý", primary: true }],
  in_progress: [{ status: "done", label: "Đã xử lý", primary: true }],
  done: [{ status: "in_progress", label: "Mở lại" }],
};

/** One small button per next status, each posting the row id and the new status. */
export function StatusSteps({ id, steps, action }: { id: number; steps: StatusStep[]; action: (form: FormData) => Promise<void> }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {steps.map((step) => (
        <form key={step.status} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={step.status} />
          <button className={`h-9 rounded-full px-3.5 text-[13px] font-bold ${step.primary ? "bg-brand-600 text-white hover:bg-brand-700" : "text-brand-600 ring-1 ring-brand-300 ring-inset hover:bg-brand-50"}`}>{step.label}</button>
        </form>
      ))}
    </div>
  );
}

/** Read-only facts about a request on its detail screen. */
export function FactList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-3 rounded-box bg-white p-4 ring-1 ring-line ring-inset tab:grid-cols-2 tab:p-6">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-[13px] text-subtle">{label}</dt>
          <dd className="font-bold break-words text-brand-800">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
