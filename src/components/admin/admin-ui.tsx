import type { ReactNode } from "react";

/** Title row at the top of every admin screen. */
export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 desk:mb-7">
      <div className="min-w-0">
        <h1 className="text-2xl leading-tight font-bold text-brand-800 desk:text-[30px]">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-[15px] text-subtle">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** White panel used for tables, forms and summaries. */
export function AdminCard({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-box bg-white ring-1 ring-line ring-inset ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 tab:px-5">
          {title && <h2 className="text-base font-bold text-brand-800 desk:text-lg">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

const tones = {
  new: "bg-sun-100 text-sun-600",
  progress: "bg-brand-100 text-brand-700",
  done: "bg-surface-deep text-brand-600",
  muted: "bg-surface text-subtle",
  warn: "bg-warn-soft text-warn",
} as const;

/** Small status pill. */
export function StatusBadge({ tone, children }: { tone: keyof typeof tones; children: ReactNode }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export const appointmentStatus = {
  new: { label: "Mới", tone: "new" },
  confirmed: { label: "Đã xác nhận", tone: "progress" },
  done: { label: "Đã tiêm", tone: "done" },
  cancelled: { label: "Đã hủy", tone: "muted" },
} as const;

export const consultStatus = {
  new: { label: "Mới", tone: "new" },
  in_progress: { label: "Đang xử lý", tone: "progress" },
  done: { label: "Đã xử lý", tone: "done" },
} as const;

const dateTime = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const formatDateTime = (date: Date) => dateTime.format(date);
