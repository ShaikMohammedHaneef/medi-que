
import { useState } from "react";
import { Outlet } from "react-router";
import StaffNavbar from "../components/StaffNavbar.jsx";
import StaffSidebar from "../components/StaffSidebar.jsx";

function StaffLayout({
  portalLabel,
  role,
  sidebarTitle,
  sidebarDescription,
  navigationItems,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827]">
      <StaffNavbar
        portalLabel={portalLabel}
        role={role}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/40 lg:hidden"
          />
        )}

        <StaffSidebar
          title={sidebarTitle}
          description={sidebarDescription}
          navigationItems={navigationItems}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;
