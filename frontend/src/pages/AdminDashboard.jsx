import { NavLink } from "react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Activity,
  XCircle,
  Stethoscope,
  Users,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    appointmentsBooked: 0,
    appointmentsCompleted: 0,
    appointmentsWaiting: 0,
    appointmentsInProgress: 0,
    appointmentsCancelled: 0,
    activeDoctors: 0,
    activeReceptionists: 0,
    activeDepartments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const appointmentStats = [
    {
      title: "Appointments Booked",
      value: dashboardData.appointmentsBooked,
      icon: CalendarDays,
      color: "text-[#0B81B7] dark:text-[#72C9EB]",
      background: "bg-[#E2F5FD] dark:bg-[#123B4D]",
    },
    {
      title: "Completed",
      value: dashboardData.appointmentsCompleted,
      icon: CheckCircle2,
      color: "text-[#42A979] dark:text-[#50C48D]",
      background: "bg-[#E8F6EF] dark:bg-[#173D30]",
    },
    {
      title: "Waiting",
      value: dashboardData.appointmentsWaiting,
      icon: Clock,
      color: "text-[#D99016] dark:text-[#F7B84B]",
      background: "bg-[#FFF5DF] dark:bg-[#49391D]",
    },
    {
      title: "In Progress",
      value: dashboardData.appointmentsInProgress,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      background: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      title: "Cancelled",
      value: dashboardData.appointmentsCancelled,
      icon: XCircle,
      color: "text-[#DC2828] dark:text-[#EF5350]",
      background: "bg-[#FDECEC] dark:bg-[#4A2424]",
    },
  ];

  const resourceStats = [
    {
      title: "Active Doctors",
      value: dashboardData.activeDoctors,
      icon: Stethoscope,
    },
    {
      title: "Active Receptionists",
      value: dashboardData.activeReceptionists,
      icon: Users,
    },
    {
      title: "Active Departments",
      value: dashboardData.activeDepartments,
      icon: Building2,
    },
  ];

  const managementActions = [
    {
      title: "Manage Doctors",
      description: "View and manage hospital doctors.",
      path: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      title: "Manage Receptionists",
      description: "Manage receptionist accounts.",
      path: "/admin/receptionists",
      icon: Users,
    },
    {
      title: "Manage Departments",
      description: "Organize hospital departments.",
      path: "/admin/departments",
      icon: Building2,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
          Monitor hospital appointments and resources.
        </p>
      </div>

      {/* Appointment overview */}
      <section>
        <h2 className="mb-4 text-lg  font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          Today's Appointments
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {appointmentStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-[#374151] dark:bg-[#1F2937]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
                    {stat.title}
                  </p>

                  <div className={`rounded-lg p-2 ${stat.background}`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      {/* Hospital resources */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          Hospital Resources
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {resourceStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="flex items-center gap-4 rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-[#374151] dark:bg-[#1F2937]"
              >
                <div className="rounded-xl bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
                  <Icon
                    size={24}
                    className="text-[#0B81B7] dark:text-[#72C9EB]"
                  />
                </div>

                <div>
                  <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick management actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          Quick Management
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {managementActions.map((action) => {
            const Icon = action.icon;

            return (
              <NavLink
                key={action.title}
                to={action.path}
                className="group flex items-center justify-between rounded-xl border border-[#DAE0E7] bg-white p-5 transition-colors hover:border-[#0B81B7] dark:border-[#374151] dark:bg-[#1F2937] dark:hover:border-[#1598CF]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
                    <Icon
                      size={22}
                      className="text-[#0B81B7] dark:text-[#72C9EB]"
                    />
                  </div>

                  <div>
                    <p className="font-medium text-[#1D2530] dark:text-[#F3F4F6]">
                      {action.title}
                    </p>
                    <p className="mt-1 text-xs text-[#657386] dark:text-[#AAB4C2]">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-[#657386] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 dark:text-[#AAB4C2]"
                />
              </NavLink>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
