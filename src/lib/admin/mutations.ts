import "server-only";

import { type Table, sql } from "drizzle-orm";
import { updateTag } from "next/cache";

import { db } from "@/db";

/*
 * Shared row operations for the admin lists. They work on any content table that has the
 * `id`, `is_visible` and `sort_order` columns (the `listing` columns in src/db/schema.ts), so they
 * are written in SQL rather than typed per table. Callers are Server Actions that have already
 * called `requireAdmin()`.
 */

/** Shows or hides a row on the public site. */
export async function setVisible(table: Table, tag: string, id: number, visible: boolean) {
  await db.execute(sql`update ${table} set is_visible = ${visible} where id = ${id}`);
  updateTag(tag);
}

/** Sort order for a new row: after the last one. */
export async function nextSortOrder(table: Table) {
  const rows = await db.execute<{ next: number }>(sql`select coalesce(max(sort_order), -1) + 1 as next from ${table}`);
  return Number(rows[0]?.next ?? 0);
}

/** Swaps a row with the neighbour above or below it in the admin order. */
export async function moveRow(table: Table, tag: string, id: number, direction: "up" | "down") {
  const up = direction === "up";
  await db.execute(sql`
    with cur as (select id, sort_order from ${table} where id = ${id}),
    nb as (
      select id, sort_order from ${table}
      where sort_order ${up ? sql`<` : sql`>`} (select sort_order from cur)
      order by sort_order ${up ? sql`desc` : sql`asc`} limit 1
    )
    update ${table} set sort_order = case when id = (select id from cur) then (select sort_order from nb) else (select sort_order from cur) end
    where exists (select 1 from nb) and (id in (select id from cur) or id in (select id from nb))
  `);
  updateTag(tag);
}
