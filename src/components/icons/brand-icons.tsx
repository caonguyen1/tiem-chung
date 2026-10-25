import type { ReactNode, SVGProps } from "react";

/*
 * Large illustrated icons in the Tâm Trí style: a soft brand-50 disc, navy line
 * work, and one solid yellow accent — the same pairing as the logo and the clinic
 * walls. Small UI icons (arrows, phone, menu…) come from lucide-react instead.
 *
 * Every icon is drawn on a 64×64 grid with a 2.5px rounded navy stroke.
 */

const NAVY = "#283C96";
const SUN = "#FADC00";

type IconProps = SVGProps<SVGSVGElement> & {
  /** Hide the background disc when the icon sits on its own tinted tile. */
  bare?: boolean;
};

function BrandIcon({ bare, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      {!bare && <circle cx="32" cy="32" r="30" fill="#F2F4FB" />}
      <g stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

const sun = { fill: SUN, stroke: "none" } as const;
const sunOutlined = { fill: SUN } as const;

/* ---------- Quick links ---------- */

export function SyringeIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <g transform="rotate(45 32 32)">
        <rect x="26" y="30" width="12" height="12" {...sun} />
        <rect x="26" y="16" width="12" height="26" rx="2" />
        <path d="M32 16V9M27 9h10M32 42v11M26 22h5M26 27h5" />
      </g>
    </BrandIcon>
  );
}

export function AdvisorIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M13 19a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H28l-8 7v-7h-1a6 6 0 0 1-6-6Z" />
      <path d="M26 21.5a4.2 4.2 0 1 1 6.3 3.6c-1.3.8-2.3 1.7-2.3 3.2" />
      <circle cx="30" cy="32.6" r="0.6" fill={NAVY} />
      <circle cx="46" cy="44" r="8" {...sunOutlined} />
      <path d="m42.5 44 2.5 2.5 4.5-5" />
    </BrandIcon>
  );
}

export function DoctorChatIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M46 24h1a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6v6l-7-6H33a6 6 0 0 1-6-6v-1" {...sunOutlined} />
      <path d="M11 20a7 7 0 0 1 7-7h20a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7H25l-7 6v-6a7 7 0 0 1-7-7Z" fill="#fff" />
      <path d="M28 19v12M22 25h12" />
    </BrandIcon>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <ellipse cx="32" cy="51" rx="11" ry="3" strokeDasharray="3 4" />
      <path d="M32 50S18 38 18 26.5a14 14 0 0 1 28 0C46 38 32 50 32 50Z" />
      <circle cx="32" cy="27" r="5.5" {...sunOutlined} />
    </BrandIcon>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M40 15v13l3.5-2.5L47 28V15.3" {...sunOutlined} />
      <path d="M12 19c6.5-2.2 13.5-1.2 20 3v27c-6.5-4.2-13.5-5.2-20-3Z" />
      <path d="M52 19c-6.5-2.2-13.5-1.2-20 3v27c6.5-4.2 13.5-5.2 20-3Z" />
    </BrandIcon>
  );
}

/* ---------- Commitments / USP ---------- */

export function StethoscopeIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M18 13v11a8 8 0 0 0 16 0V13M15 13h6M31 13h6" />
      <path d="M26 32v6a9 9 0 0 0 18 0v-5" />
      <circle cx="44" cy="28" r="5" {...sunOutlined} />
    </BrandIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M32 12 16 18v12c0 10.5 6.8 18.6 16 22 9.2-3.4 16-11.5 16-22V18Z" />
      <path d="M32 18.5 22 22.3v7.9c0 7 4.2 12.5 10 15" {...sun} />
      <path d="m25 31 5 5 9-10" />
    </BrandIcon>
  );
}

export function TimerIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M33 34V17.5A16.5 16.5 0 0 1 49.5 34Z" {...sun} />
      <circle cx="33" cy="34" r="16.5" />
      <path d="M28 11h10M33 11v6.5M33 34l7-7M47 18l2.5-2.5" />
    </BrandIcon>
  );
}

export function ReminderIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M20 41V29a12 12 0 0 1 24 0v12l3 4H17Z" />
      <path d="M28 49a4 4 0 0 0 8 0M32 13v4" />
      <circle cx="45" cy="18" r="6.5" {...sunOutlined} />
      <path d="M45 15.5V18l1.6 1.4" />
    </BrandIcon>
  );
}

/* ---------- Disease groups ---------- */

export function HpvIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="m27.6 34.5-8.6 16 6.4-1.6 3 5.6 7.7-15.4" {...sunOutlined} />
      <path d="M36.4 34.5 45 50.5l-6.4-1.6-3 5.6-7.7-15.4" />
      <path d="M32 40c-4.8-5.8-8-10.4-8-15.4a8 8 0 0 1 16 0C40 29.6 36.8 34.2 32 40Z" />
    </BrandIcon>
  );
}

export function LungsIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M38 22c6 0 12.5 9 12.5 21.5 0 4-2.8 6.2-6 5.3L38.5 47A3.6 3.6 0 0 1 36 43.6V24.4c0-1.3.7-2.4 2-2.4Z" {...sunOutlined} />
      <path d="M26 22c-6 0-12.5 9-12.5 21.5 0 4 2.8 6.2 6 5.3l6-1.8a3.6 3.6 0 0 0 2.5-3.4V24.4c0-1.3-.7-2.4-2-2.4Z" />
      <path d="M32 12v16l-4.5 4.5M32 28l4.5 4.5" />
    </BrandIcon>
  );
}

export function InfluenzaIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M22 14a4 4 0 0 1 8 0v22.6a8 8 0 1 1-8 0Z" />
      <circle cx="26" cy="43" r="4.2" {...sun} />
      <path d="M26 39V24" />
      <circle cx="45" cy="22" r="5.5" />
      <path d="M45 13.5v3M45 27.5v3M36.5 22h3M50.5 22h3M39 16l2 2M49 26l2 2M51 16l-2 2M41 26l-2 2" />
    </BrandIcon>
  );
}

export function MosquitoIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <ellipse cx="22.5" cy="25" rx="9.5" ry="4.2" transform="rotate(-28 22.5 25)" />
      <ellipse cx="41.5" cy="25" rx="9.5" ry="4.2" transform="rotate(28 41.5 25)" />
      <ellipse cx="32" cy="39" rx="4.5" ry="10" {...sunOutlined} />
      <circle cx="32" cy="24.5" r="3.6" />
      <path d="M32 21V10M28.5 33l-8.5 3.5-3 5.5M35.5 33l8.5 3.5 3 5.5M29 38l-6.5 8.5M35 38l6.5 8.5" />
    </BrandIcon>
  );
}

export function HandIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M23 33V18.5a3 3 0 0 1 6 0V29M29 28V15a3 3 0 0 1 6 0v13M35 28.5V17.5a3 3 0 0 1 6 0V31M41 30v-4a3 3 0 0 1 6 0v12c0 8.5-6.2 14-13.5 14h-2.2c-5.6 0-9.2-2.6-12-7.4l-5.1-8.8a3 3 0 0 1 5-3.2L23 37" />
      <circle cx="31" cy="40" r="2.4" {...sun} />
      <circle cx="38.5" cy="38" r="2.4" {...sun} />
      <circle cx="35" cy="45.5" r="2" {...sun} />
    </BrandIcon>
  );
}

export function RotavirusIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M26 11v9c0 3-1.7 5-4.7 7-4.2 2.7-6.3 6.4-6.3 11.2C15 46 22 51 30 51c9.8 0 18-6 18-15 0-6.8-4.8-11-11-11h-2a5 5 0 0 1-5-5v-9" />
      <path d="M24 39c2.5 3.4 8.5 4 13 .5" />
      <circle cx="46" cy="16" r="4.5" {...sunOutlined} />
      <path d="M46 9v2.5M46 20.5V23M39 16h2.5M50.5 16H53" />
    </BrandIcon>
  );
}

export function BabyIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <circle cx="23" cy="38" r="3" {...sun} />
      <circle cx="41" cy="38" r="3" {...sun} />
      <circle cx="32" cy="34" r="15" />
      <path d="M29.5 19.4c-.6-3.4 3.6-5 5.4-2.4" />
      <path d="M27 32.5v.5M37 32.5v.5M28.5 40c2 2 5 2 7 0" />
    </BrandIcon>
  );
}

export function RashIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M17 31c0-9 6.7-16 15-16s15 7 15 16c0 9.5-6.7 18-15 18s-15-8.5-15-18Z" />
      <path d="M17.5 27c4-1 8-4 9.5-8 4 4.5 12 7.5 19.5 7" />
      <path d="M26.5 33v.4M37.5 33v.4M29 42c1.8 1.3 4.2 1.3 6 0" />
      <circle cx="22.5" cy="38.5" r="1.9" {...sun} />
      <circle cx="41.5" cy="38.5" r="1.9" {...sun} />
      <circle cx="25" cy="44" r="1.5" {...sun} />
      <circle cx="39" cy="44" r="1.5" {...sun} />
      <circle cx="44" cy="31.5" r="1.5" {...sun} />
    </BrandIcon>
  );
}

export function BlisterIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M14 30c0-8 6-14 14-14h8c8 0 14 6 14 14v4c0 8-6 14-14 14h-8c-8 0-14-6-14-14Z" />
      <circle cx="25" cy="27" r="4.2" {...sunOutlined} />
      <circle cx="39" cy="36" r="5" {...sunOutlined} />
      <circle cx="37" cy="24" r="2" {...sun} />
      <circle cx="25" cy="39" r="2" {...sun} />
    </BrandIcon>
  );
}

export function LiverIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M13 28c0-6 5.5-9 13-9h18.5c6.5 0 8.5 4.5 6 10C47 37.5 37 46 27 46c-8.8 0-14-7.4-14-18Z" />
      <path d="M33 19c-1.5 6-1 12 3 17" />
      <path d="M17.5 29.5c0-3.5 3-5.5 7.5-5.5" stroke={SUN} strokeWidth={4} />
    </BrandIcon>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M32 16c-2-3-8-3.5-10 .5-4.5-.5-7.5 3.5-6 7.5-4 2-4.5 8-.5 10.5-1.5 4.5 2 9 7 8 1.5 4 7.5 5 9.5 1V16Z" />
      <path d="M32 16c2-3 8-3.5 10 .5 4.5-.5 7.5 3.5 6 7.5 4 2 4.5 8 .5 10.5 1.5 4.5-2 9-7 8-1.5 4-7.5 5-9.5 1Z" {...sunOutlined} />
      <path d="M22 24c2.5 0 4 1.5 4.5 3.5M20 34c3 0 5-1.5 5.5-4M42 24c-2.5 0-4 1.5-4.5 3.5M44 34c-3 0-5-1.5-5.5-4" />
    </BrandIcon>
  );
}

export function VirusIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <circle cx="32" cy="32" r="11" {...sunOutlined} />
      <path d="M32 13v8M32 43v8M13 32h8M43 32h8M18.6 18.6l5.6 5.6M39.8 39.8l5.6 5.6M45.4 18.6l-5.6 5.6M24.2 39.8l-5.6 5.6" />
      <circle cx="28.5" cy="29" r="1.6" fill={NAVY} stroke="none" />
      <circle cx="35.5" cy="34.5" r="2" fill={NAVY} stroke="none" />
    </BrandIcon>
  );
}

/* ---------- Audiences (vaccine packages) ---------- */

export function RingsIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <circle cx="26" cy="37" r="11" />
      <circle cx="38" cy="37" r="11" />
      <path d="m34.5 15 3.5-4 3.5 4-3.5 5Z" {...sunOutlined} />
    </BrandIcon>
  );
}

export function PregnancyIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <circle cx="30" cy="15" r="4.5" />
      <path d="M33 30.5c5.8 1 9.5 5.2 9.5 10.3 0 4.6-3.6 7.2-8.5 7.2" {...sunOutlined} />
      <path d="M28.5 22.5c-3 2.2-4.5 6-4.5 10.5 0 5.5 2 9.5 3 15M33 23c1.5 2.5.8 5.5 0 7.5M27 50h-4M34 50v-2" />
    </BrandIcon>
  );
}

export function HeartPlusIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M32 49S14 38.5 14 25.5A9 9 0 0 1 32 21a9 9 0 0 1 18 4.5C50 38.5 32 49 32 49Z" />
      <circle cx="45" cy="44" r="7.5" {...sunOutlined} />
      <path d="M45 40.5v7M41.5 44h7" />
    </BrandIcon>
  );
}

export function PulseIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <rect x="12" y="16" width="40" height="32" rx="7" {...sunOutlined} />
      <path d="M17 33h7l3.5-7 5 13 4-9 2.5 3H47" />
    </BrandIcon>
  );
}

export const brandIcons = {
  syringe: SyringeIcon,
  advisor: AdvisorIcon,
  doctorChat: DoctorChatIcon,
  location: LocationIcon,
  book: BookIcon,
  stethoscope: StethoscopeIcon,
  shield: ShieldIcon,
  timer: TimerIcon,
  reminder: ReminderIcon,
  hpv: HpvIcon,
  lungs: LungsIcon,
  influenza: InfluenzaIcon,
  mosquito: MosquitoIcon,
  hand: HandIcon,
  rotavirus: RotavirusIcon,
  baby: BabyIcon,
  rash: RashIcon,
  blister: BlisterIcon,
  liver: LiverIcon,
  brain: BrainIcon,
  virus: VirusIcon,
  rings: RingsIcon,
  pregnancy: PregnancyIcon,
  heartPlus: HeartPlusIcon,
  pulse: PulseIcon,
} as const;

export type BrandIconName = keyof typeof brandIcons;

export function BrandIconByName({ name, ...props }: IconProps & { name: BrandIconName }) {
  const Icon = brandIcons[name];
  return <Icon {...props} />;
}
