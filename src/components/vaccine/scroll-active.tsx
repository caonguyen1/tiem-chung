"use client";

import { useEffect } from "react";

/** Scrolls the `aria-current` item of the package list into view (sideways on phones, inside the list on desktop). */
export function ScrollActive({ listSelector }: { listSelector: string }) {
  useEffect(() => {
    document.querySelector(`${listSelector} [aria-current="page"]`)?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [listSelector]);
  return null;
}
