import { Plus } from "lucide-react";

function AdminPageHeader({
  title,
  description,
  buttonLabel,
  onAdd,
  icon: Icon,
  countLabel,
  count,
}) {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            {title}
          </h1>

          <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0B81B7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#096D9B]"
        >
          <Plus size={18} />
          {buttonLabel}
        </button>
      </div>

      {/* Count card */}
      <div className="flex items-center gap-3 rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-[#374151] dark:bg-[#1F2937]">
        <div className="rounded-lg bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
          <Icon
            size={22}
            className="text-[#0B81B7] dark:text-[#72C9EB]"
          />
        </div>

        <div>
          <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
            {countLabel}
          </p>

          <p className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPageHeader;