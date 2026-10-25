const vnd = new Intl.NumberFormat("vi-VN");

/** 2950000 → "2.950.000đ" */
export function formatVnd(amount: number) {
  return `${vnd.format(amount)}đ`;
}

/** 4210 → "4,2K" */
export function formatCount(count: number) {
  if (count < 1000) return String(count);
  return `${(count / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}K`;
}

export function discountPercent(price: number, originalPrice: number) {
  return Math.round((1 - price / originalPrice) * 100);
}
