import { useEffect, useState } from "react";
import {
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  Stethoscope,
  CircleAlert,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

export default function ReceptionistLiveQueue() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [queue, setQueue] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [error, setError] = useState("");

  // Fetch active doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/receptionists/doctors");
        setDoctors(response.data);
      } catch (error) {
        setError("Failed to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch selected doctor's queue
  const fetchQueue = async (doctorCode) => {
    if (!doctorCode) return;

    setLoadingQueue(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        `/receptionists/queue/${doctorCode}`
      );

      setQueue(response.data);
    } catch (error) {
      setError("Failed to load doctor's queue.");
      setQueue([]);
    } finally {
      setLoadingQueue(false);
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorCode) => {
    setSelectedDoctor(doctorCode);
    setQueue([]);
    fetchQueue(doctorCode);
  };

  const selectedDoctorDetails = doctors.find(
    (doctor) => doctor.doctorCode === selectedDoctor
  );

  const waitingCount = queue.filter(
    (patient) => patient.status === "WAITING"
  ).length;

  const inProgressCount = queue.filter(
    (patient) => patient.status === "IN_PROGRESS"
  ).length;

  const completedCount = queue.filter(
    (patient) => patient.status === "COMPLETED"
  ).length;

  const statCards = [
    {
      title: "Total Patients",
      value: queue.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Waiting",
      value: waitingCount,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "WAITING":
        return "bg-amber-100 text-amber-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-white">
            Live Queue
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor patient queues by doctor.
          </p>
        </div>

        <button
          onClick={() => fetchQueue(selectedDoctor)}
          disabled={!selectedDoctor || loadingQueue}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DAE0E7] bg-white px-4 py-2 text-sm font-medium text-[#1D2530] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#1F2937] dark:text-white dark:hover:bg-gray-800"
        >
          <RefreshCw
            size={16}
            className={loadingQueue ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Doctor Selection */}
      <div className="rounded-xl border border-[#DAE0E7] bg-white p-5 dark:border-gray-700 dark:bg-[#1F2937]">
        <label
          htmlFor="doctor"
          className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-gray-200"
        >
          Select Doctor
        </label>

        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => handleDoctorChange(e.target.value)}
          disabled={loadingDoctors}
          className="w-full rounded-lg border border-[#DAE0E7] bg-white px-3 py-2.5 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:max-w-md"
        >
          <option value="">
            {loadingDoctors ? "Loading doctors..." : "Choose a doctor"}
          </option>

          {doctors.map((doctor) => (
            <option key={doctor.doctorId} value={doctor.doctorCode}>
              {doctor.fullName} — {doctor.DepartmentName}
            </option>
          ))}
        </select>

        {!loadingDoctors && doctors.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            No active doctors available.
          </p>
        )}
      </div>

      {/* Selected Doctor Details */}
      {selectedDoctorDetails && (
        <div className="flex items-center gap-3 rounded-xl border border-[#DAE0E7] bg-white p-4 dark:border-gray-700 dark:bg-[#1F2937]">
          <div className="rounded-lg bg-sky-100 p-3 text-[#0B81B7]">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-[#1D2530] dark:text-white">
              {selectedDoctorDetails.fullName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDoctorDetails.DepartmentName}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <CircleAlert size={18} />
          {error}
        </div>
      )}

      {/* Queue Statistics */}
      {selectedDoctor && !loadingQueue && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Queue Table */}
      {selectedDoctor && (
        <div className="overflow-hidden rounded-xl border border-[#DAE0E7] bg-white dark:border-gray-700 dark:bg-[#1F2937]">
          <div className="border-b border-[#DAE0E7] p-5 dark:border-gray-700">
            <h2 className="font-semibold text-[#1D2530] dark:text-white">
              Patient Queue
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Today's queue for the selected doctor.
            </p>
          </div>

          {loadingQueue ? (
            <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading queue...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Unable to load queue.
            </div>
          ) : queue.length === 0 ? (
            <div className="p-10 text-center">
              <Users
                size={32}
                className="mx-auto text-gray-400"
              />
              <p className="mt-3 font-medium text-[#1D2530] dark:text-white">
                No patients in queue
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No appointments have been booked for this doctor today.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Queue</th>
                    <th className="px-5 py-3 font-medium">Token</th>
                    <th className="px-5 py-3 font-medium">Patient Name</th>
                    <th className="px-5 py-3 font-medium">Booking Time</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#DAE0E7] dark:divide-gray-700">
                  {queue.map((patient, index) => (
                    <tr
                      key={patient.tokenNumber}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {patient.queuePosition ?? index + 1}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#0B81B7]">
                        {patient.tokenNumber}
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1D2530] dark:text-white">
                        {patient.patientName}
                      </td>

                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {patient.bookedAt
                          ? new Date(patient.bookedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            patient.status
                          )}`}
                        >
                          {patient.status?.replace("_", " ") || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!selectedDoctor && !loadingDoctors && doctors.length > 0 && (
        <div className="rounded-xl border border-dashed border-[#DAE0E7] p-10 text-center dark:border-gray-700">
          <Stethoscope size={32} className="mx-auto text-gray-400" />
          <p className="mt-3 font-medium text-[#1D2530] dark:text-white">
            Select a doctor to view their queue
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a doctor from the dropdown above.
          </p>
        </div>
      )}
    </div>
  );
}