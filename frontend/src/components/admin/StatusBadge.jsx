function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-[#E8F6EF] text-[#278557] dark:bg-[#173D30] dark:text-[#50C48D]"
          : "bg-[#FDECEC] text-[#DC2828] dark:bg-[#4A2424] dark:text-[#EF5350]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default StatusBadge;