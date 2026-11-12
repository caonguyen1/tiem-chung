import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border border-line bg-white px-4 text-[15px] text-brand-800 outline-none placeholder:text-subtle focus:border-brand-bright focus:ring-4 focus:ring-brand-100";

/** Label, optional hint and the control, stacked. */
export function Field({ label, hint, required, children, className = "" }: { label: string; hint?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-bold text-brand-800">
        {label}
        {required && <span className="text-warn"> *</span>}
      </span>
      {children}
      {hint && <span className="text-[13px] text-subtle">{hint}</span>}
    </label>
  );
}

type Common = { label: string; hint?: string; className?: string };

export function TextInput({ label, hint, className, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} hint={hint} required={props.required} className={className}>
      <input {...props} className={`${control} h-12`} />
    </Field>
  );
}

export function TextArea({ label, hint, className, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} hint={hint} required={props.required} className={className}>
      <textarea {...props} className={`${control} py-3 leading-relaxed`} />
    </Field>
  );
}

export function Select({ label, hint, className, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} hint={hint} required={props.required} className={className}>
      <select {...props} className={`${control} h-12`}>
        {children}
      </select>
    </Field>
  );
}

/** On/off switch posted as `name=on`. */
export function Check({ label, hint, name, defaultChecked }: { label: string; hint?: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 size-5 shrink-0 accent-brand-600" />
      <span>
        <span className="block text-[15px] font-bold text-brand-800">{label}</span>
        {hint && <span className="block text-[13px] text-subtle">{hint}</span>}
      </span>
    </label>
  );
}

/** A titled group of fields inside a form. */
export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-box bg-white p-4 ring-1 ring-line ring-inset tab:p-6">
      <legend className="sr-only">{title}</legend>
      <div>
        <h2 className="text-lg font-bold text-brand-800">{title}</h2>
        {description && <p className="text-[14px] text-subtle">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

/** Search-engine title and description, on every content module (spec: "trường SEO"). */
export function SeoFields({ title, description }: { title?: string | null; description?: string | null }) {
  return (
    <Section title="SEO" description="Để trống thì website tự dùng tiêu đề và mô tả của nội dung.">
      <TextInput label="Tiêu đề SEO" name="seoTitle" defaultValue={title ?? ""} maxLength={120} hint="Nên dưới 60 ký tự." />
      <TextArea label="Mô tả SEO" name="seoDescription" defaultValue={description ?? ""} rows={2} maxLength={300} hint="Nên dưới 160 ký tự." />
    </Section>
  );
}
