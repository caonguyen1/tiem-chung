"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useActionState } from "react";

import type { FormState } from "@/lib/admin/form";

/**
 * Form for a create/edit screen. `action` is a Server Action that validates, saves and either
 * redirects to the list or returns `{ error }`. The error banner is announced to screen readers.
 */
export function AdminForm({
  action,
  children,
  cancelHref,
  submitLabel = "Lưu",
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  cancelHref: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="grid gap-4">
      {children}
      {state.error && (
        <p role="alert" className="rounded-xl bg-warn-soft px-4 py-3 text-[15px] font-bold text-warn">
          {state.error}
        </p>
      )}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur tab:-mx-6 tab:px-6 desk:-mx-8 desk:px-8">
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-7 text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-70">
          {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {pending ? "Đang lưu…" : submitLabel}
        </button>
        <Link href={cancelHref} className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-bold text-brand-600 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
          Hủy
        </Link>
      </div>
    </form>
  );
}
