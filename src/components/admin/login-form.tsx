"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";

import { login, type LoginState } from "@/lib/actions/auth";

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-brand-800 outline-none focus:border-brand-bright focus:ring-4 focus:ring-brand-100";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="grid gap-4" noValidate>
      <label className="grid gap-1.5">
        <span className="text-sm font-bold text-brand-800">Email</span>
        <input name="email" type="email" autoComplete="username" required autoFocus className={field} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-bold text-brand-800">Mật khẩu</span>
        <span className="relative block">
          <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required className={`${field} pr-12`} />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-subtle hover:bg-brand-50 hover:text-brand-600"
          >
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </span>
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-warn-soft px-3 py-2 text-sm font-bold text-warn">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
