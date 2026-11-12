import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Tôi nên tiêm gì" };

const genderLabel = { all: "Nam và nữ", nu: "Nữ", nam: "Nam" } as const;

export default async function RecommendationsAdminPage() {
  await requireAdmin();
  const [ages, rules, picks] = await Promise.all([
    db.select().from(schema.ageGroups).orderBy(asc(schema.ageGroups.sortOrder)),
    db
      .select({ id: schema.recommendationRules.id, ageGroupId: schema.recommendationRules.ageGroupId, gender: schema.recommendationRules.gender, packageName: schema.vaccinePackages.name })
      .from(schema.recommendationRules)
      .leftJoin(schema.vaccinePackages, eq(schema.vaccinePackages.id, schema.recommendationRules.packageId)),
    db.select({ ruleId: schema.recommendationRuleVaccines.ruleId }).from(schema.recommendationRuleVaccines),
  ]);

  return (
    <>
      <AdminPageHeader title="Tôi nên tiêm gì" description="Với mỗi khoảng tuổi (và giới tính), chọn các vắc xin lẻ và gói vắc xin sẽ được gợi ý cho khách." />
      <AdminCard>
        <ul className="divide-y divide-line">
          {ages.map((age) => {
            const own = rules.filter((rule) => rule.ageGroupId === age.id);
            return (
              <li key={age.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 tab:px-5">
                <div className="min-w-0 flex-1 basis-60">
                  <p className="font-bold text-brand-800">{age.label}</p>
                  <p className="mt-1 flex flex-wrap gap-2 text-[13px] text-subtle">
                    {own.length === 0 ? (
                      <StatusBadge tone="muted">Chưa có gợi ý</StatusBadge>
                    ) : (
                      own.map((rule) => (
                        <span key={rule.id}>
                          <b className="text-brand-800">{genderLabel[rule.gender]}</b>: {picks.filter((pick) => pick.ruleId === rule.id).length} vắc xin{rule.packageName ? `, ${rule.packageName}` : ""}
                        </span>
                      ))
                    )}
                  </p>
                </div>
                <Link href={`/admin/goi-y/${age.id}`} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-brand-600 ring-1 ring-brand-300 ring-inset hover:bg-brand-50">
                  <Pencil aria-hidden="true" className="size-4" />
                  Cấu hình
                </Link>
              </li>
            );
          })}
        </ul>
      </AdminCard>
    </>
  );
}
