import { Clock3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center px-4 py-26 text-center md:py-32 gap-6">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 dark:border-slate-300/20 px-5 py-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 tracking-wide ">
        <Clock3 size={14} strokeWidth={1.8} />
        <span>Hospital OP Queue Management System</span>
      </div>
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-5xl md:text-6xl">
        Skip the wait, not your turn
      </h1>
      <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
        Register, get a token, and track your queue position with real-time
        waiting time estimates.
      </p>
      <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className=" px-5 w-full py-3 sm:flex-1 rounded-lg bg-[#0B81B7] text-sm font-medium text-white transition-colors hover:bg-[#096B98] whitespace-nowrap">
          Register Patient
        </button>
        <button className="border w-full sm:flex-1 whitespace-nowrap border-slate-300/80 dark:border-slate-300/20 px-5 py-3 rounded-lg text-sm font-medium hover:text-white hover:bg-[#0B81B7]">
            Track Queue Status
        </button>
      </div>
    </section>
  );
}
