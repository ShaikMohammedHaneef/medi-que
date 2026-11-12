import { useEffect, useState } from "react";
import { Plus, Pencil, Power, Stethoscope } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    doctorCode: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    qualification: "",
    departmentId: "",
  });

  const [editingDoctor, setEditingDoctor] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const updateDoctorStatus = async (doctor, action) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/doctors/${doctor.doctorId}/${action}`,
      );

      setDoctors((prevDoctors) =>
        prevDoctors.map((item) =>
          item.doctorId === doctor.doctorId ? response.data : item,
        ),
      );

      setSelectedDoctor(null);
    } catch (error) {
      console.error("Failed to update doctor status:", error);
      setError(
        error.response?.data?.message || "Unable to update doctor status.",
      );
    }
  };

  const handleToggleDoctor = (doctor) => {
    if (doctor.active) {
      setSelectedDoctor(doctor);
      return;
    }

    updateDoctorStatus(doctor, "activate");
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitDoctor = async (e) => {
    e.preventDefault();

    if (!formData.departmentId) {
      setFormError("Please select a department.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const requestData = {
        doctorCode: formData.doctorCode.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        qualification: formData.qualification.trim(),
        departmentId: Number(formData.departmentId),
      };

      if (editingDoctor) {
        await axiosInstance.put(
          `/admin/doctors/${editingDoctor.doctorId}`,
          requestData,
        );
      } else {
        await axiosInstance.post("/admin/doctors", {
          ...requestData,
          password: formData.password,
        });
      }

      const response = await axiosInstance.get("/admin/doctors");
      setDoctors(response.data);

      setShowAddModal(false);
      setEditingDoctor(null);
      setFormData({
        doctorCode: "",
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        qualification: "",
        departmentId: "",
      });
    } catch (error) {
      console.error("Failed to save doctor:", error);
      setFormError(error.response?.data?.message || "Unable to save doctor.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/admin/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setError("Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            Doctor Management
          </h1>
          <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-1">
            Manage doctors and their department assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError("");
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B81B7] hover:bg-[#096D9B] text-white text-sm font-medium transition"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      {/* Doctor count */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#DAE0E7] dark:border-[#374151] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#E2F5FD] dark:bg-[#123B4D]">
            <Stethoscope
              size={22}
              className="text-[#0B81B7] dark:text-[#72C9EB]"
            />
          </div>

          <div>
            <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
              Total Doctors
            </p>
            <p className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
              {doctors.length}
            </p>
          </div>
        </div>
      </div>

      {/* Doctors table */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#DAE0E7] dark:border-[#374151] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#DAE0E7] dark:border-[#374151]">
          <h2 className="font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            All Doctors
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#657386] dark:text-[#AAB4C2]">
            Loading doctors...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-[#DC2828]">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#657386] dark:text-[#AAB4C2]">
            No doctors found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] dark:bg-[#273548] text-[#657386] dark:text-[#AAB4C2]">
                <tr>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Qualification</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Availability</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DAE0E7] dark:divide-[#374151]">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.doctorId}
                    className="hover:bg-[#F9FAFB] dark:hover:bg-[#273548] transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1D2530] dark:text-[#F3F4F6]">
                        {doctor.fullName}
                      </p>
                      <p className="text-xs text-[#657386] dark:text-[#AAB4C2] mt-1">
                        {doctor.doctorCode}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#1D2530] dark:text-[#F3F4F6]">
                      {doctor.departmentName}
                    </td>

                    <td className="px-5 py-4 text-[#657386] dark:text-[#AAB4C2]">
                      {doctor.qualification}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-[#1D2530] dark:text-[#F3F4F6]">
                        {doctor.email}
                      </p>
                      <p className="text-xs text-[#657386] dark:text-[#AAB4C2] mt-1">
                        {doctor.phoneNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          doctor.active
                            ? "bg-[#E8F7EF] text-[#258653] dark:bg-[#16402E] dark:text-[#50C48D]"
                            : "bg-[#FEECEC] text-[#DC2828] dark:bg-[#4B2020] dark:text-[#EF5350]"
                        }`}
                      >
                        {doctor.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          doctor.available
                            ? "bg-[#E8F7EF] text-[#258653] dark:bg-[#16402E] dark:text-[#50C48D]"
                            : "bg-[#F3F4F6] text-[#657386] dark:bg-[#374151] dark:text-[#AAB4C2]"
                        }`}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Edit doctor"
                          onClick={() => {
                            setEditingDoctor(doctor);
                            setFormData({
                              doctorCode: doctor.doctorCode,
                              fullName: doctor.fullName,
                              email: doctor.email,
                              password: "",
                              phoneNumber: doctor.phoneNumber,
                              qualification: doctor.qualification,
                              departmentId:
                                departments.find(
                                  (department) =>
                                    department.name === doctor.departmentName,
                                )?.departmentId || "",
                            });
                            setFormError("");
                            setShowAddModal(true);
                          }}
                          className="p-2 rounded-lg text-[#0B81B7] hover:bg-[#E2F5FD] dark:hover:bg-[#123B4D] transition"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title={
                            doctor.active
                              ? "Deactivate doctor"
                              : "Activate doctor"
                          }
                          className={`p-2 rounded-lg transition ${
                            doctor.active
                              ? "text-[#DC2828] hover:bg-[#FEECEC] dark:hover:bg-[#4B2020]"
                              : "text-[#42A979] hover:bg-[#E8F7EF] dark:hover:bg-[#16402E]"
                          }`}
                          onClick={() => handleToggleDoctor(doctor)}
                        >
                          <Power size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-[#1F2937] shadow-xl">
            <div className="p-5 border-b border-[#DAE0E7] dark:border-[#374151]">
              <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h2>
              <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-1">
                Enter the doctor's details to create an account.
              </p>
            </div>

            <form onSubmit={handleSubmitDoctor} className="p-5 space-y-4">
              {formError && (
                <p className="text-sm text-[#DC2828] bg-[#FEECEC] dark:bg-[#4B2020] p-3 rounded-lg">
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["doctorCode", "Doctor Code", "Enter unique doctor code"],
                  ["fullName", "Full Name", "Enter doctor's full name"],
                  ["email", "Email", "Enter email address"],
                  ...(!editingDoctor
                    ? [["password", "Password", "Create a password"]]
                    : []),
                  ["phoneNumber", "Phone Number", "Enter phone number"],
                  ["qualification", "Qualification", "Enter qualification"],
                ].map(([name, label, placeholder]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6] mb-1.5">
                      {label}
                    </label>

                    <input
                      type={
                        name === "password"
                          ? "password"
                          : name === "email"
                            ? "email"
                            : "text"
                      }
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] bg-white dark:bg-[#273548] text-[#1D2530] dark:text-[#F3F4F6] text-sm outline-none focus:border-[#0B81B7]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6] mb-1.5">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] bg-white dark:bg-[#273548] text-[#1D2530] dark:text-[#F3F4F6] text-sm outline-none focus:border-[#0B81B7]"
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option
                      key={department.departmentId}
                      value={department.departmentId}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoctor(null);
                    setFormError("");
                    setFormData({
                      doctorCode: "",
                      fullName: "",
                      email: "",
                      password: "",
                      phoneNumber: "",
                      qualification: "",
                      departmentId: "",
                    });
                  }}
                  className="px-4 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] text-sm text-[#657386] dark:text-[#AAB4C2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-lg bg-[#0B81B7] hover:bg-[#096D9B] disabled:opacity-60 text-white text-sm font-medium"
                >
                  {submitting
                    ? "Saving..."
                    : editingDoctor
                      ? "Save Changes"
                      : "Create Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#1F2937] shadow-xl p-6">
            <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
              Deactivate Doctor?
            </h2>

            <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-3">
              Are you sure you want to deactivate{" "}
              <strong>{selectedDoctor.fullName}</strong>? This doctor will no
              longer be available for new patient bookings.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] text-sm text-[#657386] dark:text-[#AAB4C2]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => updateDoctorStatus(selectedDoctor, "deactivate")}
                className="px-4 py-2.5 rounded-lg bg-[#DC2828] hover:bg-[#B91C1C] text-white text-sm font-medium"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDoctors;
