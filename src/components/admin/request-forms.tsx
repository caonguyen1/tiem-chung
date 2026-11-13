import { AdminForm } from "@/components/admin/admin-form";
import { Section, Select, TextArea } from "@/components/admin/admin-fields";
import { appointmentStatus, consultStatus } from "@/components/admin/admin-ui";
import { saveAppointment, saveConsult } from "@/lib/actions/admin/requests";

/** Status and private note of an appointment. The customer's own details are shown above by the page. */
export function AppointmentForm({ id, status, staffNote }: { id: number; status: keyof typeof appointmentStatus; staffNote?: string | null }) {
  return (
    <AdminForm action={saveAppointment} cancelHref="/admin/lich-hen" submitLabel="Lưu">
      <input type="hidden" name="id" value={id} />
      <Section title="Xử lý">
        <Select label="Trạng thái" name="status" defaultValue={status} required>
          {Object.entries(appointmentStatus).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label}
            </option>
          ))}
        </Select>
        <TextArea label="Ghi chú nội bộ" name="staffNote" defaultValue={staffNote ?? ""} rows={4} maxLength={2000} hint="Chỉ nhân viên thấy, không hiện cho khách." />
      </Section>
    </AdminForm>
  );
}

export function ConsultForm({ id, status, staffNote }: { id: number; status: keyof typeof consultStatus; staffNote?: string | null }) {
  return (
    <AdminForm action={saveConsult} cancelHref="/admin/tu-van" submitLabel="Lưu">
      <input type="hidden" name="id" value={id} />
      <Section title="Xử lý">
        <Select label="Trạng thái" name="status" defaultValue={status} required>
          {Object.entries(consultStatus).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label}
            </option>
          ))}
        </Select>
        <TextArea label="Ghi chú nội bộ" name="staffNote" defaultValue={staffNote ?? ""} rows={4} maxLength={2000} hint="Chỉ nhân viên thấy, không hiện cho khách." />
      </Section>
    </AdminForm>
  );
}
