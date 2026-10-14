export default function Mission() {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wider text-[#0B81B7] dark:text-[#1598CF] text-center mb-5">
        Our Mission
      </p>
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#DAE0E7] bg-white px-6 py-12 text-center dark:border-[#374151] dark:bg-[#1F2937] sm:px-12 sm:py-16">
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-4xl">
          Making every hospital visit more predictable.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Our mission is to make outpatient queue management more transparent
          and organized, helping patients understand their place in the queue
          while helping hospitals manage patient flow more effectively.
        </p>
      </div>
    </>
  );
}
