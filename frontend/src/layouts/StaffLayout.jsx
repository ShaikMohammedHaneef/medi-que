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
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827]">
      <StaffNavbar portalLabel={portalLabel} role={role} />

      <div className="flex min-h-[calc(100vh-64px)]">
        <StaffSidebar
          title={sidebarTitle}
          description={sidebarDescription}
          navigationItems={navigationItems}
        />

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;