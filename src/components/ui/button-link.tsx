import { AppLink } from "@/components/ui/app-link";
import type { ComponentProps } from "react";

type Variant = "primary" | "sun" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_20px_-8px_rgb(40_60_150/0.6)]",
  sun: "bg-sun-400 text-brand-900 hover:bg-sun-300 shadow-[0_8px_20px_-10px_rgb(179_156_0/0.9)]",
  outline: "border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
  white: "bg-white text-brand-700 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
    variants[variant],
    sizes[size],
  ].join(" ");
}

type ButtonLinkProps = ComponentProps<typeof AppLink> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className = "", ...props }: ButtonLinkProps) {
  return <AppLink className={`${buttonClasses(variant, size)} ${className}`} {...props} />;
}
