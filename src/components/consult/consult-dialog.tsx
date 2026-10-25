"use client";

import { CheckCircle2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AdvisorIcon } from "../icons/brand-icons";
import { buttonClasses } from "../ui/button-link";

const HASH = "#tu-van";

/**
 * "Yêu cầu tư vấn" popup (spec page 11). Any link to `#tu-van` opens it, so
 * buttons across the site need no shared state.
 */
export function ConsultDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const sync = () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (window.location.hash === HASH && !dialog.open) {
        setSent(false);
        dialog.showModal();
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const clearHash = useCallback(() => {
    if (window.location.hash === HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={clearHash}
      onClick={(event) => event.target === dialogRef.current && close()}
      aria-labelledby="consult-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-[var(--radius-card)] bg-white p-0 shadow-2xl backdrop:bg-brand-950/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative bg-brand-50 px-6 pt-6 pb-5">
        <button
          type="button"
          onClick={close}
          aria-label="Đóng"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-brand-700 hover:bg-white"
        >
          <X className="size-5" />
        </button>
        <AdvisorIcon bare className="size-14" />
        <h2 id="consult-title" className="mt-3 text-2xl font-bold text-brand-800">
          Yêu cầu tư vấn
        </h2>
        <p className="mt-1 text-[15px] text-muted">Để lại thông tin, chuyên viên Tâm Trí sẽ gọi lại cho bạn trong 15 phút (giờ hành chính).</p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <CheckCircle2 className="size-12 text-brand-500" />
          <p className="mt-3 text-lg font-semibold text-brand-800">Đã nhận yêu cầu của bạn</p>
          <p className="mt-1 text-muted">Tâm Trí sẽ liên hệ lại sớm nhất.</p>
          <button type="button" onClick={close} className={`${buttonClasses("outline", "md")} mt-6`}>
            Đóng
          </button>
        </div>
      ) : (
        <form
          method="post"
          className="grid gap-4 px-6 py-6"
          onSubmit={(event) => {
            // The demo has no backend yet; the CMS "Yêu cầu tư vấn" collection will receive this.
            event.preventDefault();
            setSent(true);
          }}
        >
          <Field label="Họ và tên" name="name" autoComplete="name" required />
          <Field label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink">Bạn cần tư vấn về</span>
            <select
              name="topic"
              className="h-12 rounded-xl border border-line bg-white px-4 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            >
              <option>Vắc xin cho trẻ em</option>
              <option>Vắc xin trước và trong thai kỳ</option>
              <option>Vắc xin cho người lớn</option>
              <option>Gói vắc xin</option>
              <option>Khác</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink">Ghi chú</span>
            <textarea
              name="note"
              rows={3}
              className="rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <button type="submit" className={`${buttonClasses("primary", "lg")} mt-1 w-full`}>
            Gửi yêu cầu
          </button>
        </form>
      )}
    </dialog>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-ink">
        {label}
        {props.required && <span className="text-alert"> *</span>}
      </span>
      <input
        {...props}
        className="h-12 rounded-xl border border-line px-4 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
      />
    </label>
  );
}
