import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "./admin-ui";
import { ConfirmSubmit } from "./confirm-submit";

/** Search box (GET form, so the address keeps the query) and the "add" button. */
export function ListToolbar({ query, placeholder, addHref, addLabel, hideSearch = false }: { query: string; placeholder: string; addHref: string; addLabel: string; hideSearch?: boolean }) {
  return (
    <div className={`mb-4 flex flex-wrap items-center gap-3 ${hideSearch ? "justify-end" : ""}`}>
      <form className={`relative min-w-0 flex-1 basis-60 ${hideSearch ? "hidden" : ""}`} role="search">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
        <input type="search" name="q" defaultValue={query} placeholder={placeholder} className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-[15px] outline-none focus:border-brand-bright focus:ring-4 focus:ring-brand-100" />
      </form>
      <Link href={addHref} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[15px] font-bold text-white hover:bg-brand-700">
        <Plus aria-hidden="true" className="size-4" />
        {addLabel}
      </Link>
    </div>
  );
}

/** Page links under a list. `hrefFor` builds the address of a page, keeping the search query. */
export function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (page: number) => string }) {
  if (pages <= 1) return null;
  const link = "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold";
  return (
    <nav aria-label="Phân trang" className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Link key={number} href={hrefFor(number)} aria-current={number === page ? "page" : undefined} className={`${link} ${number === page ? "bg-brand-600 text-white" : "bg-white text-brand-600 ring-1 ring-line ring-inset hover:bg-brand-50"}`}>
          {number}
        </Link>
      ))}
    </nav>
  );
}

export const PAGE_SIZE = 15;

/** Reads `?q=` and `?page=` from the search params of a list page. */
export function listParams(raw: { q?: string | string[]; page?: string | string[] }) {
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q)?.trim().slice(0, 80) ?? "";
  const page = Math.max(1, Number.parseInt((Array.isArray(raw.page) ? raw.page[0] : raw.page) ?? "1", 10) || 1);
  return { q, page, offset: (page - 1) * PAGE_SIZE };
}

type Action = (form: FormData) => Promise<void>;

/**
 * Actions at the end of a row: move up/down (when the list has an order), show/hide, edit, delete.
 * Each button is a tiny form that posts the row id to a Server Action.
 */
export function RowActions({
  id,
  editHref,
  visible,
  onToggle,
  onMove,
  onDelete,
  deleteMessage,
  deleteBlocked,
}: {
  id: number;
  editHref: string;
  visible?: boolean;
  onToggle?: Action;
  onMove?: (form: FormData) => Promise<void>;
  onDelete: Action;
  deleteMessage: string;
  /** When set, delete is disabled and this explains why. */
  deleteBlocked?: string;
}) {
  const icon = "grid size-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 disabled:opacity-30";
  return (
    <div className="flex items-center justify-end gap-0.5">
      {onMove && (
        <>
          <form action={onMove}>
            <input type="hidden" name="id" value={id} />
            <button name="direction" value="up" aria-label="Chuyển lên" title="Chuyển lên" className={icon}>
              <ArrowUp aria-hidden="true" className="size-4" />
            </button>
          </form>
          <form action={onMove}>
            <input type="hidden" name="id" value={id} />
            <button name="direction" value="down" aria-label="Chuyển xuống" title="Chuyển xuống" className={icon}>
              <ArrowDown aria-hidden="true" className="size-4" />
            </button>
          </form>
        </>
      )}
      {onToggle && (
        <form action={onToggle}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="visible" value={visible ? "" : "on"} />
          <button aria-label={visible ? "Ẩn khỏi website" : "Hiện trên website"} title={visible ? "Đang hiện, bấm để ẩn" : "Đang ẩn, bấm để hiện"} className={icon}>
            {visible ? <Eye aria-hidden="true" className="size-4" /> : <EyeOff aria-hidden="true" className="size-4 text-subtle" />}
          </button>
        </form>
      )}
      <Link href={editHref} aria-label="Sửa" title="Sửa" className={icon}>
        <Pencil aria-hidden="true" className="size-4" />
      </Link>
      {deleteBlocked ? (
        <button type="button" disabled title={deleteBlocked} aria-label={`Không thể xóa: ${deleteBlocked}`} className="grid size-9 place-items-center rounded-lg text-subtle opacity-40">
          <Trash2 aria-hidden="true" className="size-4" />
        </button>
      ) : (
        <DeleteForm id={id} action={onDelete} message={deleteMessage} />
      )}
    </div>
  );
}

/** Delete button that asks first (see ConfirmSubmit). */
function DeleteForm({ id, action, message }: { id: number; action: Action; message: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmit message={message} />
    </form>
  );
}

/** Visibility pill for a list column. */
export function VisibleBadge({ visible }: { visible: boolean }) {
  return visible ? <StatusBadge tone="done">Đang hiện</StatusBadge> : <StatusBadge tone="muted">Đang ẩn</StatusBadge>;
}

/** Table frame for a list: header row on tablet and up, stacked cards on phones. */
export function ListTable({ columns, children, empty }: { columns: { label: string; className?: string }[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-box bg-white ring-1 ring-line ring-inset">
      <div className="hidden border-b border-line bg-surface-soft px-5 py-2.5 text-[13px] font-bold tracking-[0.04em] text-subtle uppercase tab:flex">
        {columns.map((column) => (
          <span key={column.label} className={column.className ?? "flex-1"}>
            {column.label}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-line">{children}</ul>
      {empty}
    </div>
  );
}

export function EmptyList({ text }: { text: string }) {
  return <p className="px-5 py-12 text-center text-[15px] text-subtle">{text}</p>;
}

export type SimpleRow = {
  id: number;
  title: string;
  /** Second line under the title. */
  meta?: ReactNode;
  visible?: boolean;
  /** Why this row cannot be deleted, if it cannot. */
  blocked?: string;
};

/**
 * A complete list for modules that only need title + second line + status + row actions.
 * `basePath` is the module path; rows edit at `${basePath}/${id}`.
 */
export function SimpleList({
  title,
  rows,
  basePath,
  onToggle,
  onMove,
  onDelete,
  deleteMessage,
  empty,
}: {
  title: string;
  rows: SimpleRow[];
  basePath: string;
  onToggle?: Action;
  onMove?: Action;
  onDelete: Action;
  deleteMessage: (row: SimpleRow) => string;
  empty: string;
}) {
  return (
    <ListTable columns={[{ label: title }, { label: "Trạng thái", className: "w-32" }, { label: "", className: onMove ? "w-48" : "w-32" }]} empty={rows.length === 0 && <EmptyList text={empty} />}>
      {rows.map((row) => (
        <li key={row.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5">
          <div className="min-w-0 flex-1 basis-56">
            <p className="font-bold text-brand-800">{row.title}</p>
            {row.meta && <div className="text-[13px] text-subtle">{row.meta}</div>}
          </div>
          <div className="w-32">{row.visible !== undefined && <VisibleBadge visible={row.visible} />}</div>
          <div className={onMove ? "w-48" : "w-32"}>
            <RowActions id={row.id} editHref={`${basePath}/${row.id}`} visible={row.visible} onToggle={row.visible === undefined ? undefined : onToggle} onMove={onMove} onDelete={onDelete} deleteMessage={deleteMessage(row)} deleteBlocked={row.blocked} />
          </div>
        </li>
      ))}
    </ListTable>
  );
}
