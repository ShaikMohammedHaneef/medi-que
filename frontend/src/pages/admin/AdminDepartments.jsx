import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal.jsx";
import AdminFormModal from "../../components/admin/AdminFormModal.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import AdminActionButtons from "../../components/admin/AdminActionButtons.jsx";

function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [statusError, setStatusError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingDepartment, setEditingDepartment] = useState(null);

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      if (editingDepartment) {
        await axiosInstance.put(
          `/admin/departments/${editingDepartment.departmentId}`,
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
          },
        );
      } else {
        await axiosInstance.post("/admin/departments", {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
      }

      const response = await axiosInstance.get("/admin/departments");
      setDepartments(response.data);

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save department:", error);
      setFormError(
        error.response?.data?.message || "Unable to save department.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/admin/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setError("Unable to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleToggleDepartment = async (department) => {
    setStatusError("");
    if (department.active) {
      setSelectedDepartment(department);
      return;
    }

    await updateDepartmentStatus(department, "activate");
  };

  const updateDepartmentStatus = async (department, action) => {
    try {
      setStatusError("");

      const response = await axiosInstance.patch(
        `/admin/departments/${department.departmentId}/${action}`,
      );

      setDepartments((prevDepartments) =>
        prevDepartments.map((item) =>
          item.departmentId === department.departmentId ? response.data : item,
        ),
      );

      setSelectedDepartment(null);
    } catch (error) {
      console.error("Failed to update department status:", error);
      setStatusError(
        error.response?.data?.message || "Unable to update department status.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
          Loading departments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">{error}</p>
      </div>
    );
  }

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingDepartment(null);
    setFormData({ name: "", description: "" });
    setFormError("");
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name,
      description: department.description || "",
    });

    setFormError("");
    setShowAddModal(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Page heading */}
      <AdminPageHeader
        title="Department Management"
        description="Create and manage hospital departments."
        buttonLabel="Add Department"
        onAdd={() => {
          handleCloseModal();
          setShowAddModal(true);
        }}
        icon={Building2}
        countLabel="Total Departments"
        count={departments.length}
      />

      {statusError && (
        <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">
          {statusError}
        </p>
      )}
      {/* Departments table */}
      <div className="overflow-hidden rounded-xl border border-[#DAE0E7] bg-white dark:border-[#374151] dark:bg-[#1F2937]">
        <div className="border-b border-[#DAE0E7] px-5 py-4 dark:border-[#374151]">
          <h2 className="font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            All Departments
          </h2>
        </div>

        {departments.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Building2 size={32} className="mx-auto text-[#AAB4C2]" />
            <p className="mt-3 font-medium text-[#1D2530] dark:text-[#F3F4F6]">
              No departments found
            </p>
            <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
              Add a department to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#F9FAFB] dark:bg-[#273548]">
                <tr className="text-xs font-medium uppercase tracking-wide text-[#657386] dark:text-[#AAB4C2]">
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DAE0E7] dark:divide-[#374151]">
                {departments.map((department) => (
                  <tr
                    key={department.departmentId}
                    className="transition hover:bg-[#F9FAFB] dark:hover:bg-[#273548]"
                  >
                    <td className="px-5 py-4 font-medium text-[#1D2530] dark:text-[#F3F4F6]">
                      {department.name}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm text-[#657386] dark:text-[#AAB4C2]">
                      {department.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge active={department.active} />
                    </td>

                    <td className="px-5 py-4">
                      <AdminActionButtons
                        active={department.active}
                        onEdit={() => handleEditDepartment(department)}
                        onToggle={() => handleToggleDepartment(department)}
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
        title={editingDepartment ? "Edit Department" : "Add Department"}
        description="Enter the details of the department."
        onClose={handleCloseModal}
        onSubmit={handleSubmitDepartment}
        submitting={submitting}
        submitLabel={editingDepartment ? "Save Changes" : "Create Department"}
      >
        {formError && (
          <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">
            {formError}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
            Department Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Cardiology"
            required
            className="w-full rounded-lg border border-[#DAE0E7] bg-white px-3 py-2.5 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] dark:border-[#374151] dark:bg-[#273548] dark:text-[#F3F4F6]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Briefly describe this department"
            rows={3}
            className="w-full resize-none rounded-lg border border-[#DAE0E7] bg-white px-3 py-2.5 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] dark:border-[#374151] dark:bg-[#273548] dark:text-[#F3F4F6]"
          />
        </div>
      </AdminFormModal>

      <AdminConfirmModal
        isOpen={!!selectedDepartment}
        title="Deactivate Department"
        message={`Are you sure you want to deactivate ${selectedDepartment?.name}?`}
        onClose={() => setSelectedDepartment(null)}
        onConfirm={() =>
          updateDepartmentStatus(selectedDepartment, "deactivate")
        }
        confirmLabel="Deactivate"
      />
    </div>
  );
}

export default AdminDepartments;
