"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import type { PackageDetail } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH } from "@/lib/routes";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

/**
 * Doses inside a package (spec page 6). Every dose is ticked; untick the ones the child or
 * adult has already had and the provisional price follows. The package discount is kept
 * proportional: price × (value of ticked doses ÷ value of all doses), where a dose's value is
 * the vaccine's single-shot price. The final price is confirmed at the center.
 */
export function PackageBuilder({ pkg }: { pkg: PackageDetail }) {
  // "<item index>:<dose index>" for every dose still wanted.
  const all = pkg.items.flatMap((item, itemIndex) => Array.from({ length: item.doses }, (_, doseIndex) => `${itemIndex}:${doseIndex}`));
  const [selected, setSelected] = useState<Set<string>>(() => new Set(all));

  const value = (keys: Iterable<string>) => {
    let sum = 0;
    for (const key of keys) sum += pkg.items[Number(key.split(":")[0])].price;
    return sum;
  };
  const totalValue = value(all);
  const selectedValue = value(selected);
  const estimate = totalValue > 0 ? Math.round((pkg.price * selectedValue) / totalValue / 1000) * 1000 : pkg.price;
  const originalEstimate = totalValue > 0 ? Math.round((pkg.originalPrice * selectedValue) / totalValue / 1000) * 1000 : pkg.originalPrice;
  const partial = selected.size !== all.length;
  const doneCount = all.length - selected.size;

  const toggle = (key: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div>
      <p className="mb-3 rounded-lg bg-surface-soft px-3 py-2 text-[13px] text-body tab:text-sm">
        Bỏ chọn mũi đã tiêm để xem giá tạm tính. Bác sĩ sẽ kiểm tra sổ tiêm chủng và xác nhận lại khi bạn đến.
      </p>
      <ul className="grid gap-2.5">
        {pkg.items.map((item, itemIndex) => (
          <li key={item.slug} className="rounded-xl border border-line p-3 tab:p-4">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <AppLink href={`/vac-xin/${item.slug}`} className="text-base font-bold text-brand-800 hover:underline desk:text-lg">
                  {item.name}
                </AppLink>
                <p className="text-[13px] text-subtle tab:text-sm">
                  {item.origin} · {item.prevents}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-brand-600">{item.doses} mũi</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {Array.from({ length: item.doses }, (_, doseIndex) => {
                const key = `${itemIndex}:${doseIndex}`;
                const checked = selected.has(key);
                return (
                  <label
                    key={key}
                    className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-bold transition select-none ${checked ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-subtle line-through"}`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggle(key)} className="sr-only" />
                    <span aria-hidden="true" className={`grid size-4 place-items-center rounded-full ${checked ? "bg-white text-brand-600" : "border border-line"}`}>
                      {checked && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    Mũi {doseIndex + 1}
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="mt-3 rounded-xl bg-surface-soft p-3.5 tab:p-5">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-subtle">{partial ? "Giá tạm tính" : "Giá gói"}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-[28px] leading-none font-bold text-brand-600 tab:text-[32px]">{formatVnd(estimate)}</span>
              <s className="text-sm text-subtle">{formatVnd(originalEstimate)}</s>
              <span className="rounded-lg bg-warn-soft px-2 py-0.5 text-xs font-bold text-warn">-{discountPercent(pkg.price, pkg.originalPrice)}%</span>
            </div>
            <p className="mt-1.5 text-[13px] text-subtle">
              {selected.size}/{all.length} mũi được chọn
              {doneCount > 0 && ` (đã bỏ ${doneCount} mũi đã tiêm)`}
              {partial && ` · Giá gói đầy đủ: ${formatVnd(pkg.price)}`}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 tab:flex tab:w-auto">
            <ButtonLink href={CONSULT_HASH} variant="secondary" size="md">
              Yêu cầu tư vấn
            </ButtonLink>
            <ButtonLink href={bookingHref(pkg.slug)} size="md">
              Đặt hẹn
            </ButtonLink>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          Giá tạm tính chỉ để tham khảo. Giá cuối cùng và số mũi cần tiêm được xác nhận tại trung tâm sau khi bác sĩ khám sàng lọc.
        </p>
      </div>
    </div>
  );
}
