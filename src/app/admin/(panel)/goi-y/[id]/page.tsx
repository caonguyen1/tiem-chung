import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { RulesEditor } from "@/components/admin/rules-editor";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Cấu hình gợi ý" };

export default async function EditRulesPage({ params }: PageProps<"/admin/goi-y/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[age], vaccines, packages, rules, picks] = await Promise.all([
    db.select().from(schema.ageGroups).where(eq(schema.ageGroups.id, id)),
    db.select({ id: schema.vaccines.id, name: schema.vaccines.name }).from(schema.vaccines).orderBy(asc(schema.vaccines.sortOrder)),
    db.select({ id: schema.vaccinePackages.id, name: schema.vaccinePackages.name }).from(schema.vaccinePackages).orderBy(asc(schema.vaccinePackages.sortOrder)),
    db.select().from(schema.recommendationRules).where(eq(schema.recommendationRules.ageGroupId, id)),
    db
      .select({ ruleId: schema.recommendationRuleVaccines.ruleId, vaccineId: schema.recommendationRuleVaccines.vaccineId })
      .from(schema.recommendationRuleVaccines)
      .innerJoin(schema.recommendationRules, eq(schema.recommendationRules.id, schema.recommendationRuleVaccines.ruleId))
      .where(eq(schema.recommendationRules.ageGroupId, id)),
  ]);
  if (!age) notFound();
  const initial = Object.fromEntries(rules.map((rule) => [rule.gender, { packageId: rule.packageId, vaccineIds: picks.filter((pick) => pick.ruleId === rule.id).map((pick) => pick.vaccineId) }]));
  return (
    <>
      <AdminPageHeader title={`Gợi ý cho ${age.label}`} description="Khách chọn khoảng tuổi và giới tính ở trang “Tôi nên tiêm gì?” sẽ thấy các gợi ý dưới đây." />
      <RulesEditor ageGroupId={age.id} vaccines={vaccines} packages={packages} initial={initial} />
    </>
  );
}
