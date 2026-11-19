import { Pencil, Power } from "lucide-react";

function AdminActionButtons({
  active,
  onEdit,
  onToggle,
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        title="Edit"
        onClick={onEdit}
        className="rounded-lg p-2 text-[#0B81B7] transition hover:bg-[#E2F5FD] dark:text-[#72C9EB] dark:hover:bg-[#123B4D]"
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        title={active ? "Deactivate" : "Activate"}
        onClick={onToggle}
        className={`rounded-lg p-2 transition ${
          active
            ? "text-[#DC2828] hover:bg-[#FEECEC] dark:hover:bg-[#4B2020]"
            : "text-[#42A979] hover:bg-[#E8F7EF] dark:hover:bg-[#16402E]"
        }`}
      >
        <Power size={18} />
      </button>
    </div>
  );
}

export default AdminActionButtons;