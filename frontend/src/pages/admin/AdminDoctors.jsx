import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import AdminFormModal from "../../components/admin/AdminFormModal.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import AdminActionButtons from "../../components/admin/AdminActionButtons.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

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
      setStatusError("");

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
      setStatusError(
        error.response?.data?.message || "Unable to update doctor status.",
      );
    }
  };

  const handleToggleDoctor = (doctor) => {
    setStatusError("");
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

      handleCloseModal();
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

  const handleCloseModal = () => {
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
  };

  const handleEditDoctor = (doctor) => {
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
          (department) => department.name === doctor.departmentName,
        )?.departmentId || "",
    });

    setFormError("");
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <AdminPageHeader
        title="Doctor Management"
        description="Manage doctors and their department assignments."
        buttonLabel="Add Doctor"
        onAdd={() => {
          handleCloseModal();
          setShowAddModal(true);
        }}
        icon={Stethoscope}
        countLabel="Total Doctors"
        count={doctors.length}
      />
      {statusError && (
        <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">
          {statusError}
        </p>
      )}
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
                      <StatusBadge active={doctor.active} />
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
                      <AdminActionButtons
                        active={doctor.active}
                        onEdit={() => handleEditDoctor(doctor)}
                        onToggle={() => handleToggleDoctor(doctor)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminFormModal
        isOpen={showAddModal}
        title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDoctor}
        submitting={submitting}
        submitLabel={editingDoctor ? "Save Changes" : "Create Doctor"}
      >
        {formError && <p className="text-sm text-red-600">{formError}</p>}

        {[
          ["doctorCode", "Doctor Code", "Enter doctor code", "text"],
          ["fullName", "Full Name", "Enter full name", "text"],
          ["email", "Email", "Enter email address", "email"],
          ...(!editingDoctor
            ? [["password", "Password", "Enter password", "password"]]
            : []),
          ["phoneNumber", "Phone Number", "Enter phone number", "tel"],
          ["qualification", "Qualification", "Enter qualification", "text"],
        ].map(([name, label, placeholder, type]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 text-[#1D2530] dark:text-[#F3F4F6]">
              {label}
            </label>

            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              required
              className="w-full rounded-lg border border-[#DAE0E7] dark:border-[#374151] bg-white dark:bg-[#273548] px-3 py-2.5 text-sm text-[#1D2530] dark:text-white outline-none focus:ring-2 focus:ring-[#0B81B7]"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1 text-[#1D2530] dark:text-[#F3F4F6]">
            Department
          </label>

          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-[#DAE0E7] dark:border-[#374151] bg-white dark:bg-[#273548] px-3 py-2.5 text-sm text-[#1D2530] dark:text-white"
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
      </AdminFormModal>

      <AdminConfirmModal
        isOpen={!!selectedDoctor}
        title="Deactivate Doctor"
        message={`Are you sure you want to deactivate ${selectedDoctor?.fullName}? They will no longer be able to log in.`}
        onClose={() => setSelectedDoctor(null)}
        onConfirm={() => updateDoctorStatus(selectedDoctor, "deactivate")}
        confirmLabel="Deactivate"
      />
    </div>
  );
}

export default AdminDoctors;
