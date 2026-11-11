import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import logo from "../assets/logo/medique-logo.png";
import {
  Sun,
  Moon,
  UserRound,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

function StaffNavbar({
  portalLabel = "Staff Portal",
  role = "STAFF",
  onMenuClick,
  sidebarOpen,
}) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const dashboardRoutes = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  RECEPTIONIST: "/receptionist/dashboard",
};

  function handleLogout() {
    localStorage.removeItem("token");
    setProfileOpen(false);
    navigate("/auth/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#DAE0E7] bg-white px-1 sm:px-5 dark:border-[#374151] dark:bg-[#1F2937]">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-[#657386] hover:bg-[#F3F4F6] dark:text-[#AAB4C2] dark:hover:bg-[#374151] lg:hidden"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {/* Logo and portal label */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <NavLink to={dashboardRoutes[role]} end className="flex items-center gap-2">
          <img src={logo} alt="MediQue - Admin page" className="h-12 w-auto" />
        </NavLink>

        <div className="h-7 w-px bg-[#DAE0E7] dark:bg-[#374151]" />

        <span className="truncate text-xs font-medium text-[#657386] dark:text-[#AAB4C2] sm:text-sm">
          {portalLabel}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="hidden h-10 w-10 items-center justify-center rounded-lg text-[#657386] transition-colors hover:bg-[#F3F4F6] dark:text-[#AAB4C2] dark:hover:bg-[#273548] lg:flex"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6] dark:hover:bg-[#273548]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]">
              <UserRound size={19} />
            </div>

            <span className="hidden text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6] sm:block">
              {role}
            </span>

            <ChevronDown
              size={16}
              className="text-[#657386] dark:text-[#AAB4C2]"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-[#DAE0E7] bg-white py-1 shadow-lg dark:border-[#374151] dark:bg-[#1F2937]">
              <div className="border-b border-[#DAE0E7] px-4 py-3 dark:border-[#374151]">
                <p className="text-sm font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {role}
                </p>
                <p className="mt-1 text-xs text-[#657386] dark:text-[#AAB4C2]">
                  Staff Account
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#657386] transition-colors hover:bg-[#F3F4F6] dark:text-[#AAB4C2] dark:hover:bg-[#273548] lg:hidden"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#DC2828] transition-colors hover:bg-[#F3F4F6] dark:hover:bg-[#273548]"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default StaffNavbar;
