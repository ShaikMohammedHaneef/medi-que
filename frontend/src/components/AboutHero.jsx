
import { HeartPulse } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="px-4 py-20 text-center sm:py-24 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DAE0E7] px-4 py-2 text-sm text-[#085F87] dark:border-[#374151] dark:text-[#72C9EB]">
          <HeartPulse size={16} />
          <span>About MediQue</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-5xl md:text-6xl">
          Making hospital visits{" "}
          <span className="text-[#0B81B7] dark:text-[#1598CF]">
            simpler.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg md:leading-8">
          MediQue is a hospital outpatient queue management system
          designed to make waiting more predictable. Get a digital
          token, track your queue position, and view estimated waiting
          times without constantly wondering when your turn will come.
        </p>
      </div>
    </section>
  );
}
