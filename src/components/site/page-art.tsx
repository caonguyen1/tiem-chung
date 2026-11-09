import Image from "next/image";
import type { CSSProperties } from "react";

import { BrandIconByName, type BrandIconName } from "../icons/brand-icons";
import { VaccineVial } from "../icons/vaccine-vial";

/*
 * Illustration on the right of every inner-page banner. Each page picks a theme; the pieces are
 * the brand icons, the vaccine vial and the clinic photo, laid out on the banner image
 * with nothing else around them. Positions are percentages of the art box, so it scales as one.
 */

export type PageArtName = "vaccine" | "package" | "promo" | "recommend" | "booking" | "about" | "team" | "center" | "knowledge" | "policy" | "faq" | "icon";

type Piece =
  | { kind: "icon"; name: BrandIconName; x: number; y: number; w: number }
  | { kind: "vial"; label: string; cap: "sun" | "blue"; x: number; y: number; h: number; rot: number }
  | { kind: "photo"; src: string; x: number; y: number; w: number }
  | { kind: "tag"; x: number; y: number; w: number };

const themes: Record<Exclude<PageArtName, "icon">, Piece[]> = {
  vaccine: [
    { kind: "vial", label: "Vắc xin", cap: "sun", x: 36, y: 52, h: 74, rot: -10 },
    { kind: "vial", label: "Tâm Trí", cap: "blue", x: 56, y: 48, h: 86, rot: 6 },
    { kind: "icon", name: "syringe", x: 80, y: 68, w: 24 },
    { kind: "icon", name: "shield", x: 86, y: 26, w: 15 },
  ],
  package: [
    { kind: "icon", name: "package", x: 50, y: 52, w: 40 },
    { kind: "vial", label: "Gói", cap: "sun", x: 22, y: 60, h: 58, rot: -12 },
    { kind: "vial", label: "Gói", cap: "blue", x: 78, y: 58, h: 58, rot: 12 },
    { kind: "icon", name: "reminder", x: 80, y: 22, w: 16 },
  ],
  promo: [
    { kind: "tag", x: 46, y: 48, w: 38 },
    { kind: "icon", name: "package", x: 78, y: 66, w: 26 },
    { kind: "icon", name: "syringe", x: 18, y: 68, w: 20 },
  ],
  recommend: [
    { kind: "icon", name: "advisor", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "baby", x: 21, y: 64, w: 22 },
    { kind: "icon", name: "pregnancy", x: 79, y: 64, w: 22 },
    { kind: "icon", name: "shield", x: 78, y: 22, w: 15 },
  ],
  booking: [
    { kind: "icon", name: "calendar", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "syringe", x: 22, y: 66, w: 22 },
    { kind: "icon", name: "reminder", x: 79, y: 30, w: 20 },
  ],
  about: [
    { kind: "photo", src: "/images/facade.jpg", x: 52, y: 50, w: 64 },
    { kind: "icon", name: "stethoscope", x: 17, y: 74, w: 21 },
    { kind: "icon", name: "shield", x: 87, y: 22, w: 18 },
  ],
  team: [
    { kind: "icon", name: "stethoscope", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "doctorChat", x: 22, y: 66, w: 22 },
    { kind: "icon", name: "shield", x: 79, y: 30, w: 22 },
  ],
  center: [
    { kind: "icon", name: "location", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "timer", x: 22, y: 68, w: 21 },
    { kind: "icon", name: "shield", x: 79, y: 30, w: 21 },
  ],
  knowledge: [
    { kind: "icon", name: "book", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "baby", x: 22, y: 66, w: 21 },
    { kind: "icon", name: "heartPlus", x: 79, y: 30, w: 21 },
  ],
  policy: [
    { kind: "icon", name: "shield", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "book", x: 22, y: 68, w: 21 },
    { kind: "icon", name: "stethoscope", x: 79, y: 30, w: 21 },
  ],
  faq: [
    { kind: "icon", name: "doctorChat", x: 50, y: 50, w: 40 },
    { kind: "icon", name: "advisor", x: 22, y: 64, w: 22 },
    { kind: "icon", name: "shield", x: 79, y: 30, w: 21 },
  ],
};

function place(x: number, y: number): CSSProperties {
  return { left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" };
}

export function PageArt({ name, icon }: { name: PageArtName; icon?: BrandIconName }) {
  const pieces: Piece[] =
    name === "icon"
      ? [
          { kind: "icon", name: icon ?? "shield", x: 50, y: 50, w: 42 },
          { kind: "vial", label: "Tâm Trí", cap: "sun", x: 21, y: 60, h: 60, rot: -12 },
          { kind: "vial", label: "Tâm Trí", cap: "blue", x: 79, y: 58, h: 60, rot: 12 },
        ]
      : themes[name];

  return (
    <div aria-hidden="true" className="relative h-full aspect-[23/12]">
      {pieces.map((piece, index) => {
        if (piece.kind === "icon")
          return <BrandIconByName key={index} name={piece.name} disc="white" className="absolute h-auto" style={{ ...place(piece.x, piece.y), width: `${piece.w}%` }} />;
        if (piece.kind === "vial")
          return (
            <VaccineVial
              key={index}
              label={piece.label}
              cap={piece.cap}
              className="absolute w-auto"
              style={{ ...place(piece.x, piece.y), height: `${piece.h}%`, rotate: `${piece.rot}deg` }}
            />
          );
        if (piece.kind === "photo")
          return (
            <Image
              key={index}
              src={piece.src}
              alt=""
              width={640}
              height={400}
              sizes="300px"
              className="absolute aspect-[16/10] rounded-xl object-cover ring-4 ring-white"
              style={{ ...place(piece.x, piece.y), width: `${piece.w}%` }}
            />
          );
        return (
          <div key={index} className="absolute grid aspect-[4/3] -rotate-6 place-items-center rounded-2xl bg-sun-400 text-brand-800" style={{ ...place(piece.x, piece.y), width: `${piece.w}%` }}>
            <span className="text-[min(9vw,64px)] leading-none font-bold">%</span>
          </div>
        );
      })}
    </div>
  );
}
