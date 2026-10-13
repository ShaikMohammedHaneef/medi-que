
import { UserRound, Ticket, Clock3, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: UserRound,
    title: "Quick Registration",
    description:
      "Register patient details quickly and get started without creating an account.",
  },
  {
    icon: Ticket,
    title: "Digital Queue Token",
    description:
      "Receive a unique digital token for your selected doctor and department.",
  },
  {
    icon: Clock3,
    title: "Live Wait Estimate",
    description:
      "View your estimated waiting time and stay informed as the queue progresses",
  },
  {
    icon: LayoutDashboard,
    title: "Queue Dashboard",
    description:
      "View your estimated waiting time and stay informed as the queue progresses",
  },
];

export default function Features() {
  return (
    <section className="px-4 py-16 md:py-8 mb-5">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-700 dark:bg-[#1F2937] dark:hover:shadow-black/20"
            >
              <div className="mb-5 inline-flex rounded-xl bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
                <Icon
                  size={23}
                  strokeWidth={1.8}
                  className="text-[#0B81B7] dark:text-[#72C9EB]"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
