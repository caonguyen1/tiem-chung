"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import type { WelcomePopup as Popup } from "@/content/types";

import { AppLink } from "../ui/app-link";

const SEEN_KEY = "tam-tri-welcome-seen";

/**
 * Welcome / promotion popup (admin module "Banner & trang chủ"). Opens shortly after the
 * page loads, once per browser session; closes with the button, Esc or a click outside.
 */
export function WelcomePopup({ popup }: { popup: Popup }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!popup.enabled) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Storage can be blocked (private mode); then the popup simply opens.
    }
    const timer = window.setTimeout(() => {
      dialogRef.current?.showModal();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, 600);
    return () => window.clearTimeout(timer);
  }, [popup.enabled]);

  if (!popup.enabled) return null;
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      data-export-hide
      aria-label="Thông báo từ Tâm Trí"
      onClick={(event) => event.target === dialogRef.current && close()}
      className="m-auto w-[min(440px,calc(100%-40px))] overflow-visible bg-transparent p-0 backdrop:bg-brand-900/60"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Đóng"
        className="absolute -top-3 -right-1.5 z-[1] grid size-9 place-items-center rounded-full bg-white text-brand-600 shadow-[0_8px_20px_-8px_rgb(0_0_0/0.5)] tab:-top-3.5 tab:-right-3.5 tab:size-10"
      >
        <X className="size-[18px]" />
      </button>
      <AppLink href={popup.href} onClick={close} className="block overflow-hidden rounded-xl">
        <Image src={popup.image} alt={popup.alt} width={1080} height={1080} sizes="440px" className="aspect-square w-full" />
      </AppLink>
    </dialog>
  );
}
