import { Plus } from "lucide-react";

/** Accordion of questions (layout C): white rows, the open one turns soft blue. */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="grid gap-2 desk:gap-2.5">
      {items.map((faq) => (
        <details key={faq.question} className="group rounded-[10px] border border-line bg-white open:border-brand-bright open:bg-surface-soft">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 py-3 pr-3 pl-3.5 text-sm font-bold text-brand-800 tab:gap-5 tab:py-4 tab:pr-[18px] tab:pl-[22px] tab:text-base [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-brand-600 transition group-open:rotate-45 tab:size-8">
              <Plus className="size-4" />
            </span>
          </summary>
          <p className="px-3.5 pb-3.5 text-sm text-body tab:px-[22px] tab:pb-[18px] tab:text-[15px]">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
