import Image from "next/image";

import { ReminderIcon, ShieldIcon, StethoscopeIcon, TimerIcon } from "../icons/brand-icons";
import { SectionHeading } from "../ui/section-heading";

const commitments = [
  {
    Icon: StethoscopeIcon,
    title: "Bác sĩ khám sàng lọc",
    text: "100% khách hàng được bác sĩ khám và tư vấn trước mỗi mũi tiêm theo quy định của Bộ Y tế.",
  },
  {
    Icon: ShieldIcon,
    title: "Vắc xin nguồn gốc rõ ràng",
    text: "Nhập khẩu chính hãng, bảo quản 2–8°C và kiểm soát chuỗi lạnh trong suốt quá trình lưu trữ.",
  },
  {
    Icon: TimerIcon,
    title: "Theo dõi sau tiêm 30 phút",
    text: "Điều dưỡng theo dõi tại chỗ, sẵn sàng xử trí phản ứng sau tiêm theo phác đồ.",
  },
  {
    Icon: ReminderIcon,
    title: "Nhắc lịch tiêm qua Zalo",
    text: "Không lo quên mũi tiếp theo — Tâm Trí nhắc lịch cho cả gia đình.",
  },
];

/** Why Tâm Trí (USP block). */
export function Commitments() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] rounded-bl-[6rem]">
            <Image
              src="/images/interior-waiting.jpg"
              alt="Khu vực chờ tiêm tại Trung tâm Tâm Trí"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-2 -bottom-6 w-56 rounded-2xl bg-white p-4 shadow-lift sm:right-6">
            <p className="text-sm text-muted">Chăm sóc trọn vẹn</p>
            <p className="mt-0.5 text-lg leading-snug font-bold text-brand-800">Trước – Trong – Sau tiêm</p>
            <div className="brand-stripe mt-3 h-2 w-16 rounded-full" />
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Vì sao chọn Tâm Trí"
            title="Mỗi mũi tiêm là một lời cam kết"
            description="Đằng sau mỗi mũi tiêm của em bé là sự lo lắng của ba mẹ. Vì vậy Tâm Trí chú trọng từng trải nghiệm, từ lúc bước vào đến khi về nhà."
          />
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {commitments.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon className="size-14 shrink-0" />
                <div>
                  <h3 className="text-[17px] font-semibold text-brand-800">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
