
import { ShieldX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

function AccessDenied({ role }) {
  const navigate = useNavigate();

  const dashboardRoutes = {
    ADMIN: "/admin/dashboard",
    DOCTOR: "/doctor/dashboard",
    RECEPTIONIST: "/receptionist/dashboard",
  };

  function handleDashboardNavigation() {
    navigate(dashboardRoutes[role] || "/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] px-4 text-center transition-colors duration-200 dark:bg-[#111827]">
      <div className="mb-6 rounded-full bg-red-50 p-5 dark:bg-red-950/30">
        <ShieldX
          size={52}
          className="text-[#DC2828] dark:text-[#EF5350]"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#1D2530] dark:text-[#F3F4F6]">
        Access Denied
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-[#657386] dark:text-[#AAB4C2]">
        You don't have permission to access this page.
        Please return to your dashboard.
      </p>

      <button
        onClick={handleDashboardNavigation}
        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0B81B7] px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#096B99] dark:bg-[#1598CF] dark:hover:bg-[#0B81B7]"
      >
        <ArrowLeft size={17} />
        Go to My Dashboard
      </button>
    </div>
  );
}

export default AccessDenied;
