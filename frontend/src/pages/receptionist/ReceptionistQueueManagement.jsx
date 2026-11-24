
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ClipboardList,
  XCircle,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

export default function ReceptionistQueueManagement() {
  const [queueTokens, setQueueTokens] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingToken, setCancellingToken] = useState(null);

  const fetchQueueTokens = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/receptionists/appointments"
      );

      setQueueTokens(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load queue tokens."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get(
        "/receptionists/doctors"
      );

      setDoctors(response.data);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  useEffect(() => {
    fetchQueueTokens();
    fetchDoctors();
  }, []);

  const filteredTokens = useMemo(() => {
    return queueTokens.filter((token) => {
      const searchMatch =
        token.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        token.tokenNumber?.toLowerCase().includes(search.toLowerCase());

      const doctorMatch =
        !doctorFilter || token.doctorCode === doctorFilter;

      const statusMatch =
        !statusFilter || token.status === statusFilter;

      return searchMatch && doctorMatch && statusMatch;
    });
  }, [queueTokens, search, doctorFilter, statusFilter]);

  const handleCancel = async (tokenNumber) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel token ${tokenNumber}?`
    );

    if (!confirmed) return;

    try {
      setCancellingToken(tokenNumber);

      await axiosInstance.patch(
        `/receptionists/cancel/${tokenNumber}`
      );

      await fetchQueueTokens();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to cancel queue token."
      );
    } finally {
      setCancellingToken(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-white">
            Queue Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage today's patient queue tokens.
          </p>
        </div>

        <button
          onClick={fetchQueueTokens}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#DAE0E7] px-4 py-2 text-sm font-medium text-[#1D2530] hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-[#DAE0E7] bg-white p-4 dark:border-gray-700 dark:bg-[#1F2937]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or token..."
              className="w-full rounded-lg border border-[#DAE0E7] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0B81B7] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="rounded-lg border border-[#DAE0E7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B81B7] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctorId} value={doctor.doctorCode}>
                {doctor.fullName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#DAE0E7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B81B7] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="WAITING">Waiting</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DAE0E7] bg-white dark:border-gray-700 dark:bg-[#1F2937]">
        <div className="flex items-center justify-between border-b border-[#DAE0E7] px-5 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ClipboardList size={19} className="text-[#0B81B7]" />
            <h2 className="font-semibold text-[#1D2530] dark:text-white">
              Today's Queue Tokens
            </h2>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTokens.length} records
          </span>
        </div>

        {error ? (
          <div className="p-8 text-center text-sm text-red-500">
            {error}
          </div>
        ) : loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading queue tokens...
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No queue tokens found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Token</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Booked At</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DAE0E7] dark:divide-gray-700">
                {filteredTokens.map((token) => (
                  <tr key={token.tokenNumber}>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#0B81B7]">
                      {token.tokenNumber}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#1D2530] dark:text-white">
                      {token.patientName}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                      {token.doctorName}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                      {token.departmentName}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                      {token.bookedAt
                        ? new Date(token.bookedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(token.status)}`}
                      >
                        {token.status?.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {token.status === "WAITING" ? (
                        <button
                          onClick={() => handleCancel(token.tokenNumber)}
                          disabled={cancellingToken === token.tokenNumber}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <XCircle size={15} />
                          {cancellingToken === token.tokenNumber
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
