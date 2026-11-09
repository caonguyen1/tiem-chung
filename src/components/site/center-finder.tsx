"use client";

import { LocateFixed, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { Center } from "@/content/types";

import { CenterCard } from "./center-card";

type Coords = { latitude: number; longitude: number };

/** Great-circle distance in km. */
function distanceKm(a: Coords, b: Coords) {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const h = Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();

/**
 * Center list (spec page 15): search, province and ward pickers, and "Trung tâm gần tôi"
 * which sorts by distance from the visitor's position when the browser allows it.
 */
export function CenterFinder({ centers }: { centers: Center[] }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");
  const [here, setHere] = useState<Coords | null>(null);
  const [locating, setLocating] = useState<"idle" | "busy" | "denied">("idle");

  const provinces = useMemo(() => [...new Set(centers.map((center) => center.province))], [centers]);
  const wards = useMemo(() => [...new Set(centers.filter((center) => !province || center.province === province).flatMap((center) => (center.ward ? [center.ward] : [])))], [centers, province]);

  const list = useMemo(() => {
    const needle = fold(query.trim());
    const filtered = centers.filter(
      (center) =>
        (!province || center.province === province) &&
        (!ward || center.ward === ward) &&
        (!needle || fold(`${center.name} ${center.address} ${center.addressOld ?? ""}`).includes(needle)),
    );
    const withDistance = filtered.map((center) => ({
      center,
      km: here && center.latitude !== undefined && center.longitude !== undefined ? distanceKm(here, { latitude: center.latitude, longitude: center.longitude }) : null,
    }));
    return here ? withDistance.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity)) : withDistance;
  }, [centers, query, province, ward, here]);

  const locate = () => {
    if (!navigator.geolocation) {
      setLocating("denied");
      return;
    }
    setLocating("busy");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHere({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating("idle");
      },
      () => setLocating("denied"),
      { timeout: 10000 },
    );
  };

  const control = "h-11 w-full rounded-lg border border-line bg-surface-soft px-3 text-[14px] font-bold text-brand-800 outline-none focus:border-brand-bright";

  return (
    <div>
      <div className="grid gap-2.5 rounded-box bg-white p-3 tab:grid-cols-2 tab:p-4 desk:grid-cols-[1.4fr_1fr_1fr_auto] desk:gap-3">
        <label className="relative block">
          <span className="sr-only">Tìm trung tâm</span>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc địa chỉ" className={`${control} pl-9 font-normal`} />
        </label>
        <label>
          <span className="sr-only">Tỉnh / Thành phố</span>
          <select
            value={province}
            onChange={(event) => {
              setProvince(event.target.value);
              setWard("");
            }}
            className={control}
          >
            <option value="">Tất cả tỉnh / thành</option>
            {provinces.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Phường / Xã</span>
          <select value={ward} onChange={(event) => setWard(event.target.value)} className={control}>
            <option value="">Tất cả phường / xã</option>
            {wards.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={locate}
          disabled={locating === "busy"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-[14px] font-bold text-white hover:bg-brand-700 disabled:opacity-60 tab:col-span-2 desk:col-span-1"
        >
          <LocateFixed aria-hidden="true" className="size-4" />
          {locating === "busy" ? "Đang xác định…" : "Trung tâm gần tôi"}
        </button>
      </div>
      {locating === "denied" && <p className="mt-2 text-sm text-warn">Chưa lấy được vị trí của bạn. Hãy cho phép truy cập vị trí hoặc chọn phường / xã ở trên.</p>}

      <p className="mt-3 text-sm text-subtle" aria-live="polite">
        <b className="text-brand-800">{list.length}</b> trung tâm
      </p>
      {list.length === 0 ? (
        <p className="mt-3 rounded-box bg-white px-4 py-12 text-center text-subtle">Không tìm thấy trung tâm phù hợp.</p>
      ) : (
        <ul className="mt-3 grid gap-3 tab:grid-cols-2 desk:grid-cols-3 desk:gap-4">
          {list.map(({ center, km }) => (
            <li key={center.slug}>
              {km !== null && <p className="mb-1 text-[13px] font-bold text-link">Cách bạn khoảng {km < 10 ? km.toFixed(1) : Math.round(km)} km</p>}
              <CenterCard center={center} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
