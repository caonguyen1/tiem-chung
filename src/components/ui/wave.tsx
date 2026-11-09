/**
 * Soft curve joining a coloured section to its neighbour (layout C). Paint it with a
 * text colour class, e.g. `text-white`, matching the neighbouring section.
 * The parent needs `position: relative` and room for the curve in its padding.
 */
export function Wave({ edge, className = "" }: { edge: "top" | "bottom"; className?: string }) {
  const d =
    edge === "top"
      ? "M0 -2H1440V14C1180 34 960 6 720 18S240 34 0 12Z"
      : "M0 42H1440V26C1200 8 980 36 720 24S220 8 0 26Z";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-[1] h-7 w-full desk:h-12 ${edge === "top" ? "-top-0.5" : "-bottom-0.5"} ${className}`}
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
