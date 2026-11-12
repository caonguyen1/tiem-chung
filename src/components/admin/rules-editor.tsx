"use client";

import { useState } from "react";

import { AdminForm } from "@/components/admin/admin-form";
import { CheckList, Select } from "@/components/admin/admin-fields";
import { saveRules } from "@/lib/actions/admin/packages";

type Rule = { vaccineIds: number[]; packageId: number | null };
type Initial = Partial<Record<"all" | "nu" | "nam", Rule>>;

const labels = { all: "Nam và nữ", nu: "Nữ", nam: "Nam" } as const;

/**
 * Suggestions for one age range: the same for everyone, or separate for women and men. Each
 * block picks the vaccines (shown in the order of the vaccine list) and one package.
 */
export function RulesEditor({
  ageGroupId,
  vaccines,
  packages,
  initial,
}: {
  ageGroupId: number;
  vaccines: { id: number; name: string }[];
  packages: { id: number; name: string }[];
  initial: Initial;
}) {
  const [mode, setMode] = useState<"all" | "split">(initial.nu || initial.nam ? "split" : "all");
  const genders = mode === "split" ? (["nu", "nam"] as const) : (["all"] as const);

  return (
    <AdminForm action={saveRules} cancelHref="/admin/goi-y" submitLabel="Lưu gợi ý">
      <input type="hidden" name="ageGroupId" value={ageGroupId} />
      <input type="hidden" name="mode" value={mode} />
      <div role="radiogroup" aria-label="Cách gợi ý" className="grid gap-2 tab:grid-cols-2">
        {(
          [
            ["all", "Giống nhau cho nam và nữ"],
            ["split", "Tách riêng cho nữ và nam"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[15px] font-bold ${mode === value ? "border-brand-600 bg-surface-soft text-brand-800" : "border-line bg-white text-brand-600"}`}>
            <input type="radio" name="modeChoice" checked={mode === value} onChange={() => setMode(value)} className="size-[18px] accent-brand-600" />
            {label}
          </label>
        ))}
      </div>

      {genders.map((gender) => {
        const rule = initial[gender] ?? (gender !== "all" ? initial.all : undefined);
        return (
          <section key={`${mode}-${gender}`} className="grid gap-4 rounded-box bg-white p-4 ring-1 ring-line ring-inset tab:p-6">
            <h2 className="text-lg font-bold text-brand-800">Gợi ý cho: {labels[gender]}</h2>
            <CheckList label="Vắc xin lẻ gợi ý" name={`vaccines_${gender}`} options={vaccines.map((vaccine) => ({ value: vaccine.id, label: vaccine.name }))} selected={rule?.vaccineIds} />
            <Select label="Gói vắc xin gợi ý" name={`package_${gender}`} defaultValue={rule?.packageId ?? ""}>
              <option value="">Không gợi ý gói</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </Select>
          </section>
        );
      })}
    </AdminForm>
  );
}
