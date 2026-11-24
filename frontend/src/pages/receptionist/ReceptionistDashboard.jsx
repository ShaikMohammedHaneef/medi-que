import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ClipboardList,
  Clock,
  Stethoscope,
  CheckCircle,
  XCircle,
  UserPlus,
  Monitor,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState({
    appointmentsBooked: 0,
    waiting: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get("/receptionists/dashboard");

        setStats(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.appointmentsBooked,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Waiting",
      value: stats.waiting,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-white">
          Receptionist Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of today's hospital appointments.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>

                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <Icon size={20} className={card.color} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-semibold text-[#1D2530] dark:text-white">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-[#1D2530] dark:text-white">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate("/receptionist/book-appointment")}
            className="flex items-center gap-4 rounded-xl border border-[#DAE0E7] bg-white p-5 text-left transition hover:border-[#0B81B7] hover:shadow-sm dark:border-gray-700 dark:bg-[#1F2937]"
          >
            <div className="rounded-lg bg-sky-100 p-3 text-[#0B81B7]">
              <UserPlus size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-[#1D2530] dark:text-white">
                Book Appointment
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Register a patient and book an OP token.
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/receptionist/live-queue")}
            className="flex items-center gap-4 rounded-xl border border-[#DAE0E7] bg-white p-5 text-left transition hover:border-[#0B81B7] hover:shadow-sm dark:border-gray-700 dark:bg-[#1F2937]"
          >
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <Monitor size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-[#1D2530] dark:text-white">
                Live Queue
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor patient queues by doctor.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
