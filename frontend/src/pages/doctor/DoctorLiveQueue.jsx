
import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  UserRound,
  Activity,
  Power,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";

function DoctorLiveQueue() {
  const [queue, setQueue] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPatient = queue.find(
    (patient) => patient.status === "IN_PROGRESS",
  );

  const waitingPatients = queue.filter(
    (patient) => patient.status === "WAITING",
  );

  const fetchQueue = async () => {
    const response = await axiosInstance.get("/doctors/queue");
    setQueue(response.data);
  };

  const fetchAvailability = async () => {
    const response = await axiosInstance.get("/doctors/availability");
    setIsAvailable(response.data);
  };

  const loadData = async () => {
    try {
      setError("");
      await Promise.all([fetchQueue(), fetchAvailability()]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load queue details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAvailabilityToggle = async () => {
    try {
      setActionLoading(true);
      setError("");

      const newAvailability = !isAvailable;

      const response = await axiosInstance.patch(
        "/doctors/availability",
        { available: newAvailability },
      );

      setIsAvailable(response.data.available);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update availability.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallNext = async () => {
    try {
      setActionLoading(true);
      setError("");

      await axiosInstance.patch("/doctors/next");
      await fetchQueue();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to call next patient.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading(true);
      setError("");

      await axiosInstance.patch("/doctors/complete");
      await fetchQueue();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to complete consultation.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <RefreshCw className="animate-spin text-[#0B81B7]" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1D2530] dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Queue</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your patients and consultations.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={actionLoading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#DAE0E7] px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Availability */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937] sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-3 ${
              isAvailable
                ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                : "bg-gray-100 text-gray-500 dark:bg-gray-700"
            }`}
          >
            <Power size={22} />
          </div>

          <div>
            <h2 className="font-semibold">Doctor Availability</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAvailable
                ? "You are available to call the next patient."
                : "You are currently unavailable."}
            </p>
          </div>
        </div>

        <button
          onClick={handleAvailabilityToggle}
          disabled={actionLoading}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
            isAvailable
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#42A979] hover:bg-green-600"
          }`}
        >
          {actionLoading
            ? "Updating..."
            : isAvailable
              ? "Go Offline"
              : "Go Available"}
        </button>
      </div>

      {/* Current Patient */}
      <section className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937]">
        <div className="mb-5 flex items-center gap-2">
          <Activity className="text-[#0B81B7]" size={20} />
          <h2 className="text-lg font-semibold">Current Patient</h2>
        </div>

        {currentPatient ? (
          <div className="rounded-lg border border-blue-200 bg-[#E2F5FD] p-5 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white p-3 text-[#0B81B7] dark:bg-gray-800">
                  <UserRound size={26} />
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentPatient.patientName}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Token: {currentPatient.tokenNumber}
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                IN PROGRESS
              </span>
            </div>

            <button
              onClick={handleComplete}
              disabled={actionLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#42A979] px-4 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-50 sm:w-auto"
            >
              <CheckCircle size={18} />
              Complete Consultation
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
            <UserRound
              className="mx-auto mb-2 text-gray-400"
              size={32}
            />
            <p className="font-medium">No patient in consultation</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Call the next patient to begin a consultation.
            </p>
          </div>
        )}
      </section>

      {/* Waiting Queue */}
      <section className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937]">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Clock className="text-[#0B81B7]" size={20} />
            <h2 className="text-lg font-semibold">Upcoming Patients</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {waitingPatients.length}
            </span>
          </div>

          <button
            onClick={handleCallNext}
            disabled={
              !isAvailable ||
              !!currentPatient ||
              waitingPatients.length === 0 ||
              actionLoading
            }
            className="rounded-lg bg-[#0B81B7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionLoading ? "Please wait..." : "Call Next Patient"}
          </button>
        </div>

        {waitingPatients.length > 0 ? (
          <div className="space-y-3">
            {waitingPatients.map((patient) => (
              <div
                key={patient.tokenNumber}
                className="flex flex-col justify-between gap-3 rounded-lg border border-[#DAE0E7] p-4 dark:border-gray-700 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">{patient.patientName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Token: {patient.tokenNumber}
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  WAITING
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No patients are currently waiting.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default DoctorLiveQueue;
