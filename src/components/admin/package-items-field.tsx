"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { formatVnd } from "@/lib/format";

type Vaccine = { id: number; name: string; price: number };
type Row = { key: number; vaccineId: string; doses: number };

const control = "h-11 rounded-xl border border-line bg-white px-3 text-[15px] text-brand-800 outline-none focus:border-brand-bright focus:ring-4 focus:ring-brand-100";

/**
 * Vaccines and doses of a package. Each row posts `itemVaccine` and `itemDoses`; the total at the
 * bottom is what the doses cost bought one by one (the package's original price, kept by the server).
 */
export function PackageItemsField({ vaccines, initial }: { vaccines: Vaccine[]; initial: { vaccineId: number; doses: number }[] }) {
  const [rows, setRows] = useState<Row[]>(() => (initial.length ? initial.map((item, index) => ({ key: index, vaccineId: String(item.vaccineId), doses: item.doses })) : [{ key: 0, vaccineId: "", doses: 1 }]));
  const price = new Map(vaccines.map((vaccine) => [String(vaccine.id), vaccine.price]));
  const total = rows.reduce((sum, row) => sum + (price.get(row.vaccineId) ?? 0) * row.doses, 0);
  const doses = rows.reduce((sum, row) => sum + (row.vaccineId ? row.doses : 0), 0);

  const update = (key: number, patch: Partial<Row>) => setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  return (
    <div className="grid gap-3">
      <ul className="grid gap-2.5">
        {rows.map((row) => (
          <li key={row.key} className="grid grid-cols-[minmax(0,1fr)_88px_44px] items-center gap-2">
            <select name="itemVaccine" value={row.vaccineId} onChange={(event) => update(row.key, { vaccineId: event.target.value })} aria-label="Vắc xin" className={`${control} w-full`}>
              <option value="">Chọn vắc xin</option>
              {vaccines.map((vaccine) => (
                <option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name} · {formatVnd(vaccine.price)}
                </option>
              ))}
            </select>
            <input name="itemDoses" type="number" min={1} max={20} value={row.doses} onChange={(event) => update(row.key, { doses: Math.max(1, Number(event.target.value) || 1) })} aria-label="Số mũi" className={`${control} w-full text-center`} />
            <button type="button" onClick={() => setRows((current) => (current.length > 1 ? current.filter((item) => item.key !== row.key) : current))} aria-label="Bỏ dòng này" className="grid size-11 place-items-center rounded-xl text-warn hover:bg-warn-soft">
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setRows((current) => [...current, { key: Math.max(0, ...current.map((row) => row.key)) + 1, vaccineId: "", doses: 1 }])} className="inline-flex h-10 w-fit items-center gap-2 rounded-full px-4 text-sm font-bold text-brand-600 ring-1 ring-brand-300 ring-inset hover:bg-brand-50">
        <Plus aria-hidden="true" className="size-4" />
        Thêm vắc xin
      </button>
      <p className="rounded-lg bg-surface-soft px-3 py-2 text-[14px] text-body">
        {doses} mũi · Tổng giá khi tiêm lẻ: <b className="text-brand-800">{formatVnd(total)}</b> (đây là “giá gốc” của gói, tự cập nhật khi lưu).
      </p>
    </div>
  );
}
