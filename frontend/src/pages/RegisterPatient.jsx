import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";

export default function RegisterPatient() {
  const initialFormData = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    departmentId: "",
    doctorId: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [departments, setDepartments] = useState([]);
  const [departmentError, setDepartmentsError] = useState("");
  const [departmentLoading, setDepartmentLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const [doctorError, setDoctorError] = useState("");
  const [doctorLoading, setDoctorLoading] = useState(false);

  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      setDepartmentLoading(true);
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error) {
        setDepartmentsError(
          error.response?.data?.message ||
            "Unable to load departments. Please try again.",
        );
      } finally {
        setDepartmentLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    const departmentId = formData.departmentId;

    setDoctors([]);
    setDoctorError("");

    if (!departmentId) {
      setDoctorLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDoctors() {
      setDoctorLoading(true);

      try {
        const response = await axiosInstance.get(
          `/departments/${departmentId}/doctors`,
        );

        if (!cancelled) {
          setDoctors(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setDoctorError(
            error.response?.data?.message ||
              "Unable to load doctors for this department.",
          );
        }
      } finally {
        if (!cancelled) {
          setDoctorLoading(false);
        }
      }
    }

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, [formData.departmentId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setBookingLoading(true);
    setBookingError("");
    setBookingResult(null);

    const requestData = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      doctorId: Number(formData.doctorId)
    };

    try {
      const response = await axiosInstance.post("/patients/book", requestData);
      setBookingResult(response.data);
      setFormData(initialFormData);
      setDoctors([]);
    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
          "Unable to book your appointment. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <>
      <section className=" px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-xl bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
              <ClipboardList
                size={26}
                className="text-[#0B81B7] dark:text-[#72C9EB]"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6] sm:text-4xl">
              Book an OP Appointment
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
              Register your details, choose a department and doctor, and book
              your outpatient visit.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-[#DAE0E7] bg-white p-5 shadow-sm dark:border-[#374151] dark:bg-[#1F2937] sm:p-8"
          >
            <div>
              <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                Patient Details
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter the patient's information.
              </p>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter patient's full name"
                autoComplete="name"
                required
                className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
                >
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toLocaleDateString("en-CA")}
                  required
                  className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                required
                className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              />
            </div>

            <div className="border-t border-[#DAE0E7] pt-6 dark:border-[#374151]">
              <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                Appointment Details
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select a department first, then choose an available doctor.
              </p>
            </div>

            <div>
              <label
                htmlFor="departmentId"
                className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
              >
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={(event) => {
                  const departmentId = event.target.value;
                  setFormData((previous) => ({
                    ...previous,
                    departmentId,
                    doctorId: "",
                  }));
                }}
                required
                disabled={departmentLoading || Boolean(departmentError)}
                className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              >
                <option value="" disabled>
                  {departmentLoading
                    ? "Loading departments..."
                    : "Select a department"}
                </option>
                {departments.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.name} — {department.description}
                  </option>
                ))}
              </select>
              {departmentError && (
                <p
                  role="alert"
                  className="mt-2 text-sm text-[#DC2828] dark:text-[#EF5350]"
                >
                  {departmentError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="doctorId"
                className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
              >
                Doctor
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={
                  !formData.departmentId ||
                  doctorLoading ||
                  Boolean(doctorError)
                }
                className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              >
                <option value="" disabled>
                  {doctorLoading
                    ? "Loading doctors..."
                    : !formData.departmentId
                      ? "Select a department first"
                      : "Select a doctor"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.fullName} — {doctor.qualification}
                  </option>
                ))}
              </select>
              {doctorError && (
                <p role="alert" className="mt-2 text-sm text-[#DC2828]">
                  {doctorError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={bookingLoading}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0B81B7] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#096B98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bookingLoading ? "Booking Appointment..." : "Book Appointment"}
            </button>
          </form>
          {bookingResult && (
            <div
              role="status"
              className="rounded-xl border mt-5 border-[#42A979] bg-emerald-50 p-5 dark:bg-emerald-950/30"
            >
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                Appointment Booked Successfully!
              </h3>

              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
                Your queue token is:
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                {bookingResult.tokenNumber}
              </p>

              <div className="mt-4 space-y-2 text-sm text-[#1D2530] dark:text-[#F3F4F6]">
                <p>
                  <strong>Doctor:</strong> {bookingResult.doctorName}
                </p>
                <p>
                  <strong>Booking date:</strong> {bookingResult.bookingDate}
                </p>
                <p>
                  <strong>Status:</strong> {bookingResult.status}
                </p>
                <p>
                  <strong>Patient ID:</strong> {bookingResult.patientId}
                </p>
              </div>
              <Link
                to={`/track-queue?token=${encodeURIComponent(bookingResult.tokenNumber)}`}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0B81B7] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#096B98]"
              >
                Track Your Queue
              </Link>
            </div>
          )}

          {bookingError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {bookingError}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
