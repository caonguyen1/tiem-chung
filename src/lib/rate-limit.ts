import "server-only";

import { headers } from "next/headers";

// In memory, per server process: enough for one server. Behind a reverse proxy (nginx...) the proxy
// must set X-Forwarded-For, otherwise every visitor looks like the same address.
const hits = new Map<string, number[]>();

/** Address of the visitor, as reported by the proxy. */
export async function clientAddress() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** True when `key` has already done `limit` things in the last `windowMs`; records this one otherwise. */
export function tooMany(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  hits.set(key, [...recent, now]);
  // Forget idle keys now and then so the map does not grow forever.
  if (hits.size > 5000) for (const [name, times] of hits) if (times.every((time) => now - time >= windowMs)) hits.delete(name);
  return false;
}
