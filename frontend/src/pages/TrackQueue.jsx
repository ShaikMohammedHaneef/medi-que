import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

export default function TrackQueue() {
  const [token, setToken] = useState("");

  const [queueDetails, setQueueDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resultRef = useRef(null);

  useEffect(()=>{
    if(queueDetails && resultRef.current){
        resultRef.current.scrollIntoView({
            behavior:"smooth",
            block:"start",
        });
    }
  }, [queueDetails]);

  async function handleSubmit(event) {
    event.preventDefault();

    const submittedToken = token.trim();

    if (!submittedToken) return;

    setLoading(true);
    setError("");
    setQueueDetails(null);

    try {
      const response = await axiosInstance.get(
        `/patients/track/${encodeURIComponent(submittedToken)}`,
      );
      setQueueDetails(response.data);
    } catch (error) {
      if (error.response)
        setError(error.response.data?.message || "Failed to track queue.");
      else setError(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const statusStyles = {
    WAITING: {
      label: "Waiting",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
  };

  return (
    <>
      <section className=" px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#0B81B7] dark:text-[#1598CF]">
              Queue Tracking
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-4xl">
              Track Your Queue
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
              Enter your queue token to check your current position and
              estimated waiting time.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-xl border border-[#DAE0E7] bg-white p-5 shadow-sm dark:border-[#374151] dark:bg-[#1F2937] sm:p-7"
          >
            <label
              htmlFor="queue-token"
              className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
            >
              Queue Token
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="queue-token"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter your queue token"
                required
                className="h-11 min-h-11 min-w-0 flex-1 rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none placeholder:text-slate-400 focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0B81B7] px-5 text-sm font-medium text-white transition-colors hover:bg-[#096B98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={17} />
                {loading ? "Searching..." : "Track Queue"}
              </button>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-3 text-sm text-[#DC2828] dark:text-[#EF5350]"
              >
                {error}
              </p>
            )}

            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Your queue token was provided when your OP appointment was booked.
            </p>
          </form>
        </div>
      </section>
      {queueDetails && (
        <section
        ref={resultRef}
          aria-live="polite"
          className="mx-auto mb-10 scroll-mt-6 max-w-xl rounded-xl border border-[#DAE0E7] bg-white p-5 shadow-sm dark:border-[#374151] dark:bg-[#1F2937] sm:p-6"
        >
          {/* Token and status */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Queue Token
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0B81B7] dark:text-[#1598CF]">
                {queueDetails.tokenNumber}
              </h2>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                (
                  statusStyles[queueDetails.status] ?? {
                    label: queueDetails.status,
                    className:
                      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                  }
                ).className
              }`}
            >
              {
                (
                  statusStyles[queueDetails.status] ?? {
                    label: queueDetails.status,
                  }
                ).label
              }
            </span>
          </div>

          {/* Patient */}
          <div className="mt-4 border-t border-[#DAE0E7] pt-4 dark:border-[#374151]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Patient
            </p>
            <p className="mt-1 text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
              {queueDetails.patientName}
            </p>
          </div>

          {/* Queue metrics: only for active appointments */}
          {(queueDetails.status === "WAITING" ||
            queueDetails.status === "IN_PROGRESS") && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#F9FAFB] p-3 dark:bg-[#111827]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Queue Position
                </p>
                <p className="mt-2 text-xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {queueDetails.queuePosition}
                </p>
              </div>

              <div className="rounded-lg bg-[#F9FAFB] p-3 dark:bg-[#111827]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Patients Ahead
                </p>
                <p className="mt-2 text-xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {queueDetails.patientsAhead}
                </p>
              </div>

              <div className="col-span-2 rounded-lg bg-[#F9FAFB] p-3 dark:bg-[#111827]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Estimated Waiting Time
                </p>
                <p className="mt-1 text-xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {queueDetails.waitTime} min
                </p>
              </div>
            </div>
          )}

          {/* Final status messages */}
          {queueDetails.status === "COMPLETED" && (
            <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
              Your appointment has been completed.
            </p>
          )}

          {queueDetails.status === "CANCELLED" && (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
              This appointment has been cancelled.
            </p>
          )}

          {/* Doctor and department */}
          <div className="mt-5 border-t border-[#DAE0E7] pt-4 dark:border-[#374151]">
            <p className="text-xs text-slate-500 dark:text-slate-400">Doctor</p>
            <p className="mt-1 text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
              {queueDetails.doctorName}
            </p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Department
            </p>
            <p className="mt-1 text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
              {queueDetails.departmentName}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
              {queueDetails.departmentDescription}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
