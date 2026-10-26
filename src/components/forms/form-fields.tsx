import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

function Label({ text, required, children }: { text: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-ink">
        {text}
        {required && <span className="text-alert"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function TextField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <Label text={label} required={props.required}>
      <input {...props} className={`${control} h-12`} />
    </Label>
  );
}

export function SelectField({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <Label text={label} required={props.required}>
      <select {...props} className={`${control} h-12`}>
        {children}
      </select>
    </Label>
  );
}

export function TextAreaField({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <Label text={label} required={props.required}>
      <textarea {...props} className={`${control} py-3`} />
    </Label>
  );
}
