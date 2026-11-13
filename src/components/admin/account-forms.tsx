import { AdminForm } from "@/components/admin/admin-form";
import { Check, Section, Select, TextInput } from "@/components/admin/admin-fields";
import type { schema } from "@/db";
import { changeOwnPassword, saveAccount } from "@/lib/actions/admin/accounts";

type User = typeof schema.adminUsers.$inferSelect;

/** Create / edit an admin account. On edit, a typed password replaces the old one. */
export function AccountForm({ user, isSelf }: { user?: User; isSelf?: boolean }) {
  return (
    <AdminForm action={saveAccount} cancelHref="/admin/tai-khoan" submitLabel={user ? "Lưu thay đổi" : "Tạo tài khoản"}>
      <input type="hidden" name="id" value={user?.id ?? ""} />
      <Section title="Tài khoản">
        <TextInput label="Họ tên" name="name" defaultValue={user?.name} required maxLength={120} />
        <TextInput label="Email đăng nhập" name="email" type="email" defaultValue={user?.email} required maxLength={200} autoComplete="off" />
        <Select
          label="Vai trò"
          name="role"
          defaultValue={user?.role ?? "editor"}
          required
          disabled={isSelf}
          hint={isSelf ? "Bạn không thể tự đổi vai trò của mình." : "Quản trị viên làm được mọi việc, kể cả quản lý tài khoản. Biên tập viên quản lý nội dung, lịch hẹn và tư vấn nhưng không quản lý tài khoản."}
        >
          <option value="editor">Biên tập viên</option>
          <option value="admin">Quản trị viên</option>
        </Select>
        {isSelf && <input type="hidden" name="role" value={user?.role} />}
      </Section>
      <Section title="Mật khẩu" description={user ? "Để trống nếu không đổi. Đặt mật khẩu mới sẽ đăng xuất người này khỏi mọi thiết bị." : undefined}>
        <TextInput label={user ? "Mật khẩu mới" : "Mật khẩu"} name="password" type="password" autoComplete="new-password" required={!user} minLength={10} hint="Ít nhất 10 ký tự. Nên dùng chữ, số và ký hiệu." />
      </Section>
      <Section title="Trạng thái">
        {isSelf ? <input type="hidden" name="isActive" value="on" /> : null}
        <Check name="isActive" label="Đang hoạt động" hint="Tắt để khóa tài khoản: người này bị đăng xuất và không đăng nhập lại được." defaultChecked={user?.isActive ?? true} />
      </Section>
    </AdminForm>
  );
}

export function OwnPasswordForm() {
  return (
    <AdminForm action={changeOwnPassword} cancelHref="/admin" submitLabel="Đổi mật khẩu">
      <Section title="Đổi mật khẩu" description="Sau khi đổi, các thiết bị khác của bạn sẽ bị đăng xuất.">
        <TextInput label="Mật khẩu hiện tại" name="current" type="password" autoComplete="current-password" required />
        <TextInput label="Mật khẩu mới" name="next" type="password" autoComplete="new-password" required minLength={10} hint="Ít nhất 10 ký tự, khác mật khẩu cũ và không trùng email." />
        <TextInput label="Nhập lại mật khẩu mới" name="confirm" type="password" autoComplete="new-password" required />
      </Section>
    </AdminForm>
  );
}
