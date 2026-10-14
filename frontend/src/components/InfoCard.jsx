
export default function InfoCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <article className="rounded-xl border border-[#DAE0E7] bg-white p-6 dark:border-[#374151] dark:bg-[#1F2937]">
      <div className="mb-5 inline-flex rounded-xl bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
        <Icon
          size={24}
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
  );
}
