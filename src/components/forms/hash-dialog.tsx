"use client";

import { CheckCircle2, X } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { buttonClasses } from "../ui/button-link";

type HashDialogProps = {
  /** Opens on `#hash`, or `#hash=value`; the value is passed to `children`. */
  hash: string;
  title: string;
  description: string;
  icon: ReactNode;
  successTitle: string;
  successText: string;
  children: (args: { param: string | null; onSent: () => void }) => ReactNode;
};

/**
 * A modal opened by any link to its hash, so buttons across the site need no
 * shared state. Closing it removes the hash again.
 */
export function HashDialog({ hash, title, description, icon, successTitle, successText, children }: HashDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const [param, setParam] = useState<string | null>(null);
  const titleId = `${hash.slice(1)}-title`;

  useEffect(() => {
    const sync = () => {
      const dialog = dialogRef.current;
      const [current, value] = window.location.hash.split("=");
      if (!dialog || current !== hash) return;
      setSent(false);
      setParam(value ? decodeURIComponent(value) : null);
      if (!dialog.open) dialog.showModal();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [hash]);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const onSent = useCallback(() => setSent(true), []);

  const clearHash = useCallback(() => {
    if (window.location.hash.split("=")[0] === hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [hash]);

  return (
    <dialog
      ref={dialogRef}
      onClose={clearHash}
      onClick={(event) => event.target === dialogRef.current && close()}
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[var(--radius-card)] bg-white p-0 shadow-2xl backdrop:bg-brand-950/50 backdrop:backdrop-blur-sm"
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
        {icon}
        <h2 id={titleId} className="mt-3 text-2xl font-bold text-brand-800">
          {title}
        </h2>
        <p className="mt-1 text-[15px] text-muted">{description}</p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <CheckCircle2 className="size-12 text-brand-500" />
          <p className="mt-3 text-lg font-semibold text-brand-800">{successTitle}</p>
          <p className="mt-1 text-muted">{successText}</p>
          <button type="button" onClick={close} className={`${buttonClasses("outline", "md")} mt-6`}>
            Đóng
          </button>
        </div>
      ) : (
        children({ param, onSent })
      )}
    </dialog>
  );
}
