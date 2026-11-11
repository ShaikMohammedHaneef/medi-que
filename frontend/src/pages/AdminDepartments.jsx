import { useEffect, useState } from "react";
import { Plus, Pencil, Power, Building2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

      setShowAddModal(false);
      setEditingDepartment(null);
      setFormData({ name: "", description: "" });
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
    if (department.active) {
      setSelectedDepartment(department);
      return;
    }

    await updateDepartmentStatus(department, "activate");
  };

  const updateDepartmentStatus = async (department, action) => {
    try {
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

  return (
    <div className="w-full space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            Department Management
          </h1>
          <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
            Create and manage hospital departments.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError("");
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0B81B7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#096D9B]"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* Department count */}
      <div className="flex items-center gap-3 rounded-xl border border-[#DAE0E7] bg-white p-4 dark:border-[#374151] dark:bg-[#1F2937]">
        <div className="rounded-lg bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
          <Building2 size={22} className="text-[#0B81B7] dark:text-[#72C9EB]" />
        </div>

        <div>
          <p className="text-sm text-[#657386] dark:text-[#AAB4C2]">
            Total Departments
          </p>
          <p className="text-2xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
            {departments.length}
          </p>
        </div>
      </div>

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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          department.active
                            ? "bg-[#E8F6EF] text-[#278557] dark:bg-[#173D30] dark:text-[#50C48D]"
                            : "bg-[#FDECEC] text-[#DC2828] dark:bg-[#4A2424] dark:text-[#EF5350]"
                        }`}
                      >
                        {department.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Edit department"
                          onClick={() => {
                            setEditingDepartment(department);
                            setFormData({
                              name: department.name,
                              description: department.description || "",
                            });
                            setFormError("");
                            setShowAddModal(true);
                          }}
                          className="rounded-lg p-2 text-[#0B81B7] transition hover:bg-[#E2F5FD] dark:text-[#72C9EB] dark:hover:bg-[#123B4D]"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          title={
                            department.active
                              ? "Deactivate department"
                              : "Activate department"
                          }
                          onClick={() => handleToggleDepartment(department)}
                          className="rounded-lg p-2 text-[#657386] transition hover:bg-[#F3F4F6] dark:text-[#AAB4C2] dark:hover:bg-[#374151]"
                        >
                          <Power size={18} />
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
      {selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#1F2937]">
            <h2 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
              Deactivate Department?
            </h2>

            <p className="mt-2 text-sm text-[#657386] dark:text-[#AAB4C2]">
              Are you sure you want to deactivate{" "}
              <span className="font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {selectedDepartment.name}
              </span>
              ? It will no longer be available for new patient registrations.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDepartment(null)}
                className="rounded-lg border border-[#DAE0E7] px-4 py-2 text-sm font-medium text-[#657386] hover:bg-[#F9FAFB] dark:border-[#374151] dark:text-[#AAB4C2] dark:hover:bg-[#273548]"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  updateDepartmentStatus(selectedDepartment, "deactivate")
                }
                className="rounded-lg bg-[#DC2828] px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#1F2937]">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>
              <p className="mt-1 text-sm text-[#657386] dark:text-[#AAB4C2]">
                Enter the details of the new department.
              </p>
            </div>

            <form onSubmit={handleSubmitDepartment} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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

              {formError && (
                <p className="text-sm text-[#DC2828] dark:text-[#EF5350]">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDepartment(null);
                    setFormData({ name: "", description: "" });
                    setFormError("");
                  }}
                  disabled={submitting}
                  className="rounded-lg border border-[#DAE0E7] px-4 py-2 text-sm font-medium text-[#657386] dark:border-[#374151] dark:text-[#AAB4C2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#0B81B7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#096D9B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingDepartment
                      ? "Save Changes"
                      : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDepartments;
