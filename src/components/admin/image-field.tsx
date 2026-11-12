"use client";

import { ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  label: string;
  /** Required shape, width : height. The image is cropped to exactly this when it is chosen. */
  ratio: [number, number];
  /** Width in pixels of the saved image. */
  width?: number;
  value?: string | null;
  hint?: string;
};

const FRAME = 320;

/**
 * Image picker with a built-in crop (project rule: customers crop to the right shape while
 * uploading, nothing is cropped by CSS later). Choose a file, drag to move, slide to zoom, and the
 * cropped result is uploaded to /admin/upload; the returned address goes into a hidden input.
 */
export function ImageField({ name, label, ratio, width = 1200, value, hint }: Props) {
  const [url, setUrl] = useState(value ?? "");
  const [source, setSource] = useState<{ src: string; w: number; h: number } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [frameW, frameH] = ratio[0] >= ratio[1] ? [FRAME, Math.round((FRAME * ratio[1]) / ratio[0])] : [Math.round((FRAME * ratio[0]) / ratio[1]), FRAME];
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (source) dialogRef.current?.showModal();
  }, [source]);
  useEffect(() => () => void (source && URL.revokeObjectURL(source.src)), [source]);

  // Displayed size of the picture: it always covers the frame, times the zoom.
  const base = source ? Math.max(frameW / source.w, frameH / source.h) : 1;
  const scale = base * zoom;
  const clamp = useCallback(
    (x: number, y: number) => {
      if (!source) return { x: 0, y: 0 };
      const maxX = Math.max(0, (source.w * scale - frameW) / 2);
      const maxY = Math.max(0, (source.h * scale - frameH) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
    },
    [source, scale, frameW, frameH],
  );

  const pick = (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setError("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setSource({ src, w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => setError("Không đọc được ảnh này.");
    img.src = src;
  };

  const close = () => {
    dialogRef.current?.close();
    setSource(null);
    if (input.current) input.current.value = "";
  };

  const confirm = async () => {
    if (!source) return;
    setBusy(true);
    setError("");
    try {
      const img = new Image();
      img.src = source.src;
      await img.decode();
      const out = document.createElement("canvas");
      out.width = width;
      out.height = Math.round((width * ratio[1]) / ratio[0]);
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("canvas");
      const left = frameW / 2 - (source.w * scale) / 2 + offset.x;
      const top = frameH / 2 - (source.h * scale) / 2 + offset.y;
      ctx.drawImage(img, -left / scale, -top / scale, frameW / scale, frameH / scale, 0, 0, out.width, out.height);
      const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/webp", 0.88));
      if (!blob) throw new Error("blob");
      const body = new FormData();
      body.append("file", blob, "image.webp");
      const response = await fetch("/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "upload");
      setUrl(data.url);
      close();
    } catch (failure) {
      setError(failure instanceof Error && failure.message.includes(" ") ? failure.message : "Chưa tải được ảnh lên, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-bold text-brand-800">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface-soft" style={{ width: 160, aspectRatio: `${ratio[0]} / ${ratio[1]}` }}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus aria-hidden="true" className="size-7 text-brand-300" />
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-brand-600 ring-1 ring-brand-300 ring-inset hover:bg-brand-50">
              <ImagePlus aria-hidden="true" className="size-4" />
              {url ? "Đổi ảnh" : "Chọn ảnh"}
            </button>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-warn hover:bg-warn-soft">
                <Trash2 aria-hidden="true" className="size-4" />
                Xóa
              </button>
            )}
          </div>
          <p className="text-[13px] text-subtle">
            {hint ?? `Tỉ lệ ${ratio[0]}:${ratio[1]}.`} Ảnh được cắt đúng tỉ lệ khi chọn.
          </p>
          {error && !source && (
            <p role="alert" className="text-[13px] font-bold text-warn">
              {error}
            </p>
          )}
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => pick(event.target.files?.[0])} />

      <dialog ref={dialogRef} onClose={() => setSource(null)} className="m-auto w-[min(440px,calc(100%-24px))] rounded-box bg-white p-0 backdrop:bg-brand-900/60">
        {source && (
          <div className="grid gap-4 p-4 tab:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-800">Cắt ảnh · tỉ lệ {ratio[0]}:{ratio[1]}</h3>
              <button type="button" onClick={close} aria-label="Đóng" className="grid size-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-50">
                <X className="size-5" />
              </button>
            </div>
            <div
              className="relative mx-auto touch-none overflow-hidden rounded-lg bg-brand-900 select-none"
              style={{ width: frameW, height: frameH, cursor: "grab" }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
              }}
              onPointerMove={(event) => {
                if (drag.current) setOffset(clamp(drag.current.ox + event.clientX - drag.current.x, drag.current.oy + event.clientY - drag.current.y));
              }}
              onPointerUp={() => (drag.current = null)}
              onPointerCancel={() => (drag.current = null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={source.src}
                alt=""
                draggable={false}
                className="absolute max-w-none"
                style={{ width: source.w * scale, height: source.h * scale, left: frameW / 2 - (source.w * scale) / 2 + offset.x, top: frameH / 2 - (source.h * scale) / 2 + offset.y }}
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-white/80 ring-inset" />
            </div>
            <label className="grid gap-1 text-sm font-bold text-brand-800">
              Phóng to
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setZoom(next);
                  setOffset((current) => {
                    const factor = (base * next) / scale;
                    const maxX = Math.max(0, (source.w * base * next - frameW) / 2);
                    const maxY = Math.max(0, (source.h * base * next - frameH) / 2);
                    return { x: Math.min(maxX, Math.max(-maxX, current.x * factor)), y: Math.min(maxY, Math.max(-maxY, current.y * factor)) };
                  });
                }}
                className="accent-brand-600"
              />
            </label>
            <p className="text-[13px] text-subtle">Kéo ảnh để chọn phần giữ lại.</p>
            {error && (
              <p role="alert" className="text-[13px] font-bold text-warn">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={confirm} disabled={busy} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-70">
                {busy && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                {busy ? "Đang tải lên…" : "Dùng ảnh này"}
              </button>
              <button type="button" onClick={close} className="h-11 rounded-full px-5 text-[15px] font-bold text-brand-600 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
                Hủy
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
