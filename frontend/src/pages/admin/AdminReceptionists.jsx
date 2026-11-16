import { useEffect, useState } from "react";
import { Plus, Pencil, Power, Users } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";

function AdminReceptionists() {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(
        error.response?.data?.message ||
          "Unable to update receptionist status.",
      );
      setSelectedReceptionist(null);
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

      setShowAddModal(false);
      setEditingReceptionist(null);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
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

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            Receptionist Management
          </h1>
          <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-1">
            Manage receptionist accounts and access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingReceptionist(null);
            setFormData({
              fullName: "",
              email: "",
              password: "",
              phoneNumber: "",
            });
            setFormError("");
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B81B7] hover:bg-[#096D9B] text-white text-sm font-medium transition"
        >
          <Plus size={18} />
          Add Receptionist
        </button>
      </div>

      {/* Total receptionists */}
      <div className="bg-white dark:bg-[#1F2937] border border-[#DAE0E7] dark:border-[#374151] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#E2F5FD] dark:bg-[#123B4D]">
            <Users size={22} className="text-[#0B81B7] dark:text-[#72C9EB]" />
          </div>

          <div>
            <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
              Total Receptionists
            </p>
            <p className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
              {receptionists.length}
            </p>
          </div>
        </div>
      </div>

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
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          receptionist.active
                            ? "bg-[#E8F7EF] text-[#258653] dark:bg-[#16402E] dark:text-[#50C48D]"
                            : "bg-[#FEECEC] text-[#DC2828] dark:bg-[#4B2020] dark:text-[#EF5350]"
                        }`}
                      >
                        {receptionist.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Edit receptionist"
                          onClick={() => handleEditReceptionist(receptionist)}
                          className="p-2 rounded-lg text-[#0B81B7] hover:bg-[#E2F5FD] dark:hover:bg-[#123B4D] transition"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title={
                            receptionist.active
                              ? "Deactivate receptionist"
                              : "Activate receptionist"
                          }
                          className={`p-2 rounded-lg transition ${
                            receptionist.active
                              ? "text-[#DC2828] hover:bg-[#FEECEC] dark:hover:bg-[#4B2020]"
                              : "text-[#42A979] hover:bg-[#E8F7EF] dark:hover:bg-[#16402E]"
                          }`}
                          onClick={() => handleToggleReceptionist(receptionist)}
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
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#1F2937] shadow-xl">
            <div className="p-5 border-b border-[#DAE0E7] dark:border-[#374151]">
              <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {editingReceptionist ? "Edit Receptionist" : "Add Receptionist"}
              </h2>

              <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mt-1">
                {editingReceptionist
                  ? "Update the receptionist's account details."
                  : "Enter the receptionist's details to create an account."}
              </p>
            </div>

            <form onSubmit={handleSubmitReceptionist} className="p-5 space-y-4">
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

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReceptionist(null);
                    setFormError("");
                    setFormData({
                      fullName: "",
                      email: "",
                      password: "",
                      phoneNumber: "",
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
                    : editingReceptionist
                      ? "Save Changes"
                      : "Create Receptionist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedReceptionist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#1F2937] shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#FEECEC] dark:bg-[#4B2020]">
                <Power size={22} className="text-[#DC2828]" />
              </div>

              <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                Deactivate Receptionist?
              </h2>
            </div>

            <p className="text-sm text-[#657386] dark:text-[#AAB4C2] mb-6">
              Are you sure you want to deactivate{" "}
              <span className="font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {selectedReceptionist.fullName}
              </span>
              ? They will lose access to MediQue. Existing records will be
              preserved.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedReceptionist(null)}
                className="px-4 py-2.5 rounded-lg border border-[#DAE0E7] dark:border-[#374151] text-sm text-[#657386] dark:text-[#AAB4C2]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  updateReceptionistStatus(selectedReceptionist, "deactivate")
                }
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

export default AdminReceptionists;
