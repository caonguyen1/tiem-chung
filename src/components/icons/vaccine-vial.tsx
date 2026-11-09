import { useId, type SVGProps } from "react";

const NAVY = "#283C96";
const CAPS = { sun: "#FADC00", blue: "#4A62CF" } as const;

type VaccineVialProps = SVGProps<SVGSVGElement> & {
  /** Short name printed on the label. */
  label: string;
  cap?: keyof typeof CAPS;
};

/** Illustrated vaccine vial used on vaccine cards until real product photos exist. */
export function VaccineVial({ label, cap = "sun", ...props }: VaccineVialProps) {
  const id = useId();
  const glass = `${id}-glass`;
  const shine = `${id}-shine`;
  const capColor = CAPS[cap];
  // Long names shrink so they stay on the 62-unit label.
  const fontSize = Math.min(12, 96 / label.length).toFixed(1);

  return (
    <svg viewBox="0 0 90 200" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={glass} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
          <stop offset=".35" stopColor="#e8f0ff" stopOpacity=".85" />
          <stop offset="1" stopColor="#b9cbf5" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={shine} x1="0" x2="1">
          <stop offset="0" stopColor={capColor} />
          <stop offset=".5" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor={capColor} />
        </linearGradient>
      </defs>
      <rect x="17" y="6" width="56" height="34" rx="9" fill={capColor} />
      <rect x="17" y="6" width="56" height="34" rx="9" fill={`url(#${shine})`} opacity=".45" />
      <rect x="24" y="38" width="42" height="14" rx="3" fill="#cfd8ee" />
      <path d="M14 70c0-10 8-18 18-18h26c10 0 18 8 18 18v108c0 9-7 16-16 16H30c-9 0-16-7-16-16Z" fill={`url(#${glass})`} />
      <path d="M14 150h62v28c0 9-7 16-16 16H30c-9 0-16-7-16-16Z" fill="#9fc0ff" opacity=".7" />
      <rect x="14" y="88" width="62" height="54" fill="#fff" />
      <rect x="14" y="88" width="62" height="8" fill={NAVY} />
      <text x="45" y="121" textAnchor="middle" fontWeight="700" fontSize={fontSize} fill={NAVY} fontFamily="inherit">
        {label}
      </text>
      <text x="45" y="134" textAnchor="middle" fontWeight="700" fontSize="7" fill="#7d84a2" fontFamily="inherit">
        0.5 ml
      </text>
      <rect x="20" y="62" width="7" height="110" rx="3.5" fill="#fff" opacity=".7" />
    </svg>
  );
}
