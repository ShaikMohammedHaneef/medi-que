
import { NavLink } from "react-router";

function StaffSidebar({
  title,
  description,
  navigationItems,
  isOpen,
  onClose,
}) {
  return (
    <aside
      className={`fixed bottom-0 left-0 top-16 z-40 flex w-64 shrink-0 flex-col border-r border-[#DAE0E7] bg-white px-3 py-5 sm:px-4 sm:py-6 transition-transform duration-300 dark:border-[#374151] dark:bg-[#1F2937] lg:sticky lg:top-16 lg:z-20 lg:min-h-[calc(100vh-64px)] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 px-3">
        <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[#657386] dark:text-[#AAB4C2]">
          {description}
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#657386] hover:bg-[#F3F4F6] hover:text-[#1D2530] dark:text-[#AAB4C2] dark:hover:bg-[#273548] dark:hover:text-[#F3F4F6]"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default StaffSidebar;
