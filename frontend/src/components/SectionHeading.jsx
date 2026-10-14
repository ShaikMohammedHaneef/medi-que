
export default function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-[#0B81B7] dark:text-[#1598CF]">
        {eyebrow}
      </span>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
