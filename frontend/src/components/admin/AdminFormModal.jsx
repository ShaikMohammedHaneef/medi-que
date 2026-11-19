
function AdminFormModal({
  isOpen,
  title,
  description,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = "Save",
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-[#1F2937] shadow-xl">
        <div className="p-5 border-b border-[#DAE0E7] dark:border-[#374151]">
          <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-1">
              {description}
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {children}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] text-sm text-[#657386] dark:text-[#AAB4C2] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg bg-[#0B81B7] hover:bg-[#096D9B] disabled:opacity-60 text-white text-sm font-medium"
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminFormModal;
