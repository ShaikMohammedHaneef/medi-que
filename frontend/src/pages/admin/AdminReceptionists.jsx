import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import AdminFormModal from "../../components/admin/AdminFormModal.jsx";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import AdminActionButtons from "../../components/admin/AdminActionButtons.jsx";

function AdminReceptionists() {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [editingReceptionist, setEditingReceptionist] = useState(null);

  const [selectedReceptionist, setSelectedReceptionist] = useState(null);

  const updateReceptionistStatus = async (receptionist, action) => {
    try {
      setStatusError("");

      const response = await axiosInstance.patch(
        `/admin/receptionists/${receptionist.receptionistId}/${action}`,
      );

      setReceptionists((prev) =>
        prev.map((item) =>
          item.receptionistId === receptionist.receptionistId
            ? response.data
            : item,
        ),
      );

      setSelectedReceptionist(null);
    } catch (error) {
      console.error("Failed to update receptionist status:", error);
      setStatusError(
        error.response?.data?.message ||
          "Unable to update receptionist status.",
      );
    }
  };

  const handleToggleReceptionist = (receptionist) => {
    if (receptionist.active) {
      setSelectedReceptionist(receptionist);
    } else {
      updateReceptionistStatus(receptionist, "activate");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReceptionist = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      (!editingReceptionist && !formData.password.trim())
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const requestData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    };

    try {
      if (editingReceptionist) {
        await axiosInstance.put(
          `/admin/receptionists/${editingReceptionist.receptionistId}`,
          requestData,
        );
      } else {
        await axiosInstance.post("/admin/receptionists", {
          ...requestData,
          password: formData.password,
        });
      }

      const response = await axiosInstance.get("/admin/receptionists");
      setReceptionists(response.data);

      handleCloseModal();
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Unable to save receptionist.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReceptionist = (receptionist) => {
    setEditingReceptionist(receptionist);

    setFormData({
      fullName: receptionist.fullName,
      email: receptionist.email,
      password: "",
      phoneNumber: receptionist.phoneNumber,
    });

    setFormError("");
    setShowAddModal(true);
  };

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await axiosInstance.get("/admin/receptionists");
        setReceptionists(response.data);
      } catch (error) {
        console.error("Failed to fetch receptionists:", error);
        setError("Unable to load receptionists.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceptionists();
  }, []);

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingReceptionist(null);
    setFormError("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });
  };
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <AdminPageHeader
        title="Receptionist Management"
        description="Manage receptionist accounts and access."
        buttonLabel="Add Receptionist"
        onAdd={() => {
          handleCloseModal();
          setShowAddModal(true);
        }}
        icon={Users}
        countLabel="Total Receptionists"
        count={receptionists.length}
      />
      {statusError && (
        <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">
          {statusError}
        </p>
      )}
      {/* Receptionists table */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#DAE0E7] dark:border-[#374151] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#DAE0E7] dark:border-[#374151]">
          <h2 className="font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            All Receptionists
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#657386] dark:text-[#AAB4C2]">
            Loading receptionists...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-[#DC2828]">{error}</div>
        ) : receptionists.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#657386] dark:text-[#AAB4C2]">
            No receptionists found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] dark:bg-[#273548] text-[#657386] dark:text-[#AAB4C2]">
                <tr>
                  <th className="px-5 py-3 font-medium">Receptionist</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone Number</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DAE0E7] dark:divide-[#374151]">
                {receptionists.map((receptionist) => (
                  <tr
                    key={receptionist.receptionistId}
                    className="hover:bg-[#F9FAFB] dark:hover:bg-[#273548] transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1D2530] dark:text-[#F3F4F6]">
                        {receptionist.fullName}
                      </p>
                      <p className="text-xs text-[#657386] dark:text-[#AAB4C2] mt-1">
                        ID: {receptionist.receptionistId}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#1D2530] dark:text-[#F3F4F6]">
                      {receptionist.email}
                    </td>

                    <td className="px-5 py-4 text-[#657386] dark:text-[#AAB4C2]">
                      {receptionist.phoneNumber}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge active={receptionist.active} />
                    </td>

                    <td className="px-5 py-4">
                      <AdminActionButtons
                        active={receptionist.active}
                        onEdit={() => handleEditReceptionist(receptionist)}
                        onToggle={() => handleToggleReceptionist(receptionist)}
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
        title={editingReceptionist ? "Edit Receptionist" : "Add Receptionist"}
        description={
          editingReceptionist
            ? "Update the receptionist's account details."
            : "Enter the receptionist's details to create an account."
        }
        onClose={handleCloseModal}
        onSubmit={handleSubmitReceptionist}
        submitting={submitting}
        submitLabel={
          editingReceptionist ? "Save Changes" : "Create Receptionist"
        }
      >
        {formError && (
          <p className="text-sm text-[#DC2828] bg-[#FEECEC] dark:bg-[#4B2020] p-3 rounded-lg">
            {formError}
          </p>
        )}

        {[
          ["fullName", "Full Name", "Enter full name", "text"],
          ["email", "Email Address", "Enter email address", "email"],
          ...(!editingReceptionist
            ? [["password", "Password", "Create a password", "password"]]
            : []),
          ["phoneNumber", "Phone Number", "Enter phone number", "tel"],
        ].map(([name, label, placeholder, type]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6] mb-1.5">
              {label}
            </label>

            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] bg-white dark:bg-[#273548] text-[#1D2530] dark:text-[#F3F4F6] text-sm outline-none focus:border-[#0B81B7]"
            />
          </div>
        ))}
      </AdminFormModal>

      <AdminConfirmModal
        isOpen={!!selectedReceptionist}
        title="Deactivate Receptionist"
        message={`Are you sure you want to deactivate ${selectedReceptionist?.fullName}? They will no longer be able to log in.`}
        onClose={handleCloseModal}
        onConfirm={() =>
          updateReceptionistStatus(selectedReceptionist, "deactivate")
        }
        confirmLabel="Deactivate"
      />
    </div>
  );
}

export default AdminReceptionists;
