"use client";

import { Trash2 } from "lucide-react";

/** Submit button of a delete form: cancels the submit unless the person confirms. */
export function ConfirmSubmit({ message }: { message: string }) {
  return (
    <button
      type="submit"
      aria-label="Xóa"
      title="Xóa"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="grid size-9 place-items-center rounded-lg text-warn hover:bg-warn-soft"
    >
      <Trash2 aria-hidden="true" className="size-4" />
    </button>
  );
}
