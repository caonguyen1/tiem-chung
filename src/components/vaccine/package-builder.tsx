"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import type { PackageDetail } from "@/content/types";
import { discountPercent, formatVnd } from "@/lib/format";
import { bookingHref, CONSULT_HASH } from "@/lib/routes";

import { AppLink } from "../ui/app-link";
import { ButtonLink } from "../ui/button-link";

/**
 * Doses inside a package (spec page 6). Each vaccine starts at its full number of doses; lower
 * the count for doses already had ("3 mũi" → "2 mũi") and the provisional price follows. Prices
 * are the vaccine's single-shot price × doses, and the package price keeps its discount:
 * price × (value of the doses kept ÷ value of all doses). The final price is confirmed at the center.
 */
export function PackageBuilder({ pkg }: { pkg: PackageDetail }) {
  const [counts, setCounts] = useState<number[]>(() => pkg.items.map((item) => item.doses));

  const totalValue = pkg.items.reduce((sum, item) => sum + item.price * item.doses, 0);
  const selectedValue = pkg.items.reduce((sum, item, index) => sum + item.price * counts[index], 0);
  const totalDoses = pkg.items.reduce((sum, item) => sum + item.doses, 0);
  const selectedDoses = counts.reduce((sum, count) => sum + count, 0);
  const estimate = totalValue > 0 ? Math.round((pkg.price * selectedValue) / totalValue / 1000) * 1000 : pkg.price;
  const partial = selectedDoses !== totalDoses;

  const change = (index: number, delta: number) =>
    setCounts((current) => current.map((count, i) => (i === index ? Math.min(pkg.items[i].doses, Math.max(0, count + delta)) : count)));

  return (
    <div className="@container">
      <p className="mb-3 rounded-lg bg-surface-soft px-3 py-2 text-[13px] text-body tab:text-sm">
        Giảm số mũi ở vắc xin bạn đã tiêm để xem giá tạm tính. Bác sĩ sẽ kiểm tra sổ tiêm chủng và xác nhận lại khi bạn đến.
      </p>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {pkg.items.map((item, index) => (
          <li
            key={item.slug}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-3 py-2.5 tab:px-4 tab:py-3 @[560px]:grid-cols-[minmax(0,1fr)_auto_112px]"
          >
            <div className="min-w-0">
              <AppLink href={`/vac-xin/${item.slug}`} className="text-[15px] font-bold text-brand-800 hover:underline desk:text-base">
                {item.name}
              </AppLink>
              <p className="line-clamp-1 text-[13px] text-subtle">
                {item.origin} · {item.prevents}
              </p>
            </div>
            <div
              role="group"
              aria-label={`Số mũi ${item.name}`}
              className="col-span-2 row-start-2 inline-flex w-fit items-center rounded-full border border-line bg-white @[560px]:col-span-1 @[560px]:col-start-2 @[560px]:row-start-1"
            >
              <button
                type="button"
                onClick={() => change(index, -1)}
                disabled={counts[index] === 0}
                aria-label={`Giảm một mũi ${item.name}`}
                className="grid size-9 place-items-center rounded-full text-brand-600 hover:bg-brand-50 disabled:text-brand-200 disabled:hover:bg-transparent"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span className={`min-w-[64px] text-center text-[14px] font-bold ${counts[index] === 0 ? "text-subtle" : "text-brand-800"}`}>{counts[index]} mũi</span>
              <button
                type="button"
                onClick={() => change(index, 1)}
                disabled={counts[index] >= item.doses}
                aria-label={`Tăng một mũi ${item.name}`}
                className="grid size-9 place-items-center rounded-full text-brand-600 hover:bg-brand-50 disabled:text-brand-200 disabled:hover:bg-transparent"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
            <b className="col-start-2 row-start-1 text-right text-[15px] text-brand-600 tab:text-base @[560px]:col-start-3">{formatVnd(item.price * counts[index])}</b>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="mt-3 rounded-xl bg-surface-soft p-3.5 tab:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-brand-800">{partial ? "Giá tạm tính" : "Giá gói"}</p>
            <p className="mt-1 text-[13px] text-subtle">
              {selectedDoses}/{totalDoses} mũi được chọn
            </p>
            {partial && <p className="mt-0.5 text-[13px] text-subtle">Giá gói đầy đủ: {formatVnd(pkg.price)}</p>}
          </div>
          <div className="text-right">
            <p className="text-[28px] leading-none font-bold text-brand-600 tab:text-[34px]">{formatVnd(estimate)}</p>
            <p className="mt-1.5 flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
              <s className="text-sm text-subtle">{formatVnd(selectedValue)}</s>
              <span className="rounded-lg bg-warn-soft px-2 py-0.5 text-xs font-bold text-warn">-{discountPercent(pkg.price, pkg.originalPrice)}%</span>
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-line pt-4">
          <ButtonLink href={CONSULT_HASH} variant="secondary" size="md">
            Yêu cầu tư vấn
          </ButtonLink>
          <ButtonLink href={bookingHref(pkg.slug)} size="md">
            Đặt hẹn
          </ButtonLink>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          Giá tạm tính chỉ để tham khảo. Giá cuối cùng và số mũi cần tiêm được xác nhận tại trung tâm sau khi bác sĩ khám sàng lọc.
        </p>
      </div>
    </div>
  );
}
