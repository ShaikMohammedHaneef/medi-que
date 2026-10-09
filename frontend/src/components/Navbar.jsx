import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import logo from "../assets/logo/medique-logo.png";
import {
  House,
  Users,
  Info,
  Sun,
  Moon,
  UserRoundPlus,
  LogIn,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [menu, setMenu] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <nav className="border-b border-[#DAE0E7] bg-white dark:border-[#374151] dark:bg-[#1F2937]">
      <div className="mx-auto h-16 flex items-center max-w-[1440px] justify-between px-4 sm:px-6 lg:px-8 ">
        {/* left section */}
        <div className="flex items-center gap-8">
          <NavLink 
          to="/" end 
          onClick={() => setMenu(false)} 
          className="flex items-center">
            <img src={logo} alt="MediQue - Home" className="h-12 w-auto" />
          </NavLink>
          <div className="hidden md:flex items-center gap-4 mt-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <House size={18} strokeWidth={1.8} aria-hidden="true" />
              Home
            </NavLink>
            <NavLink
              to="/track-queue"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <Users size={18} strokeWidth={1.8} /> Track Queue
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <Info size={18} strokeWidth={1.8} /> About
            </NavLink>
          </div>
        </div>

        {/* right section */}
        <div className="hidden items-center gap-3 md:flex">
          {/* theme button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className="rounded-lg p-2 text-[#1D2530] transition-colors hover:bg-[#E2F5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B81B7] dark:text-[#F3F4F6] dark:hover:bg-[#374151]"
          >
            {isDark ? (
              <Sun size={20} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Moon size={20} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
          <button className="h-9 bg-[#0B81B7] rounded-lg  px-5 text-sm font-medium text-white transition-colors hover:bg-[#096F9D] flex gap-2 items-center">
            <UserRoundPlus size={18} strokeWidth={1.8} /> Register
          </button>
          <button className="h-9 bg-[#0B81B7] rounded-lg px-5 text-sm font-medium text-white transition-colors hover:bg-[#096f9D] flex gap-2 items-center">
            <LogIn size={18} strokeWidth={1.8} /> Sign in
          </button>
        </div>

        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className="rounded-lg p-2 text-[#1D2530] transition-colors hover:bg-[#E2F5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B81B7] dark:text-[#F3F4F6] dark:hover:bg-[#374151] "
          >
            {isDark ? (
              <Sun size={20} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Moon size={20} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu((prev) => !prev)}
            aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            className="rounded-lg p-2 text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#374151]"
          >
            {menu ? (
              <X size={20} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menu && (
        <div id="mobile-navigation" className="border-t border-[#DAE0E7] px-4 py-4 md:hidden dark:border-[#374151]">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              end
              onClick={() => setMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <House size={18} strokeWidth={1.8} aria-hidden="true" />
              Home
            </NavLink>
            <NavLink
              to="/track-queue"
              onClick={() => setMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <Users size={18} strokeWidth={1.8} /> Track Queue
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E2F5FD] text-[#085F87] dark:bg-[#123B4D] dark:text-[#72C9EB]"
                    : "text-[#1D2530] hover:bg-[#E2F5FD] dark:text-[#F3F4F6] dark:hover:bg-[#123B4D]"
                }`
              }
            >
              <Info size={18} strokeWidth={1.8} /> About
            </NavLink>

            <div className="mt-2 flex gap-3 border-t border-[#DAE0E7] pt-4 dark:border-[#374151]">
              <button className="h-10 flex-1 rounded-lg bg-[#0B81B7] text-sm font-medium text-white flex items-center justify-center gap-4">
                <UserRoundPlus size={18} strokeWidth={1.8}/>Register
              </button>

              <button className="h-10 flex-1 rounded-lg border border-[#DAE0E7] bg-white text-sm font-medium text-[#1D2530] dark:border-[#4B5563] dark:bg-[#1F2937] dark:text-[#F3F4F6] flex items-center justify-center gap-4">
                <LogIn size={18} strokeWidth={1.8}/>Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
