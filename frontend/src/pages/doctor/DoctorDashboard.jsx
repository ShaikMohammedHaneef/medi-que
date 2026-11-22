
import { useEffect, useState } from "react";
import { Users, Clock, Activity, CheckCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";

function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await axiosInstance.get("/doctors/queue");
        setQueue(response.data);
      } catch (error) {
        console.error("Failed to fetch doctor queue:", error);
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const stats = [
    {
      label: "Today's Patients",
      count: queue.length,
      icon: Users,
      color: "text-[#0B81B7]",
      bg: "bg-[#E2F5FD] dark:bg-[#123B4D]",
    },
    {
      label: "Waiting",
      count: queue.filter((p) => p.status === "WAITING").length,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "In Progress",
      count: queue.filter((p) => p.status === "IN_PROGRESS").length,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      label: "Completed",
      count: queue.filter((p) => p.status === "COMPLETED").length,
      icon: CheckCircle,
      color: "text-[#42A979]",
      bg: "bg-[#E8F6EF] dark:bg-[#173D30]",
    },
  ];

  if (loading) {
    return <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">{error}</p>;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
          Doctor Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
          Here's your patient queue overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-[#374151] dark:bg-[#1F2937]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
                  {stat.label}
                </p>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {stat.count}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DoctorDashboard;
