import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { useCreateEmployee } from "../hooks/useCreateEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";

const emptyEmployeeForm = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  position: "",
  salary: "",
  dateOfJoining: "",
};

// helper: build full image URL using backend base
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

function getImageUrl(profilePic) {
  if (!profilePic) return null;
  if (profilePic.startsWith("http")) return profilePic;
  const base = API_BASE.replace(/\/api\/v1\/?$/, "");
  return `${base}${profilePic}`;
}

function EmployeesPage() {
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Filters for searching
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  // Form state for create / edit
  const [form, setForm] = useState(emptyEmployeeForm);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [formError, setFormError] = useState("");

  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);

  // Simple "view details" state
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    data: employees,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    department: department || undefined,
    position: position || undefined,
  });

  const {
    mutate: createEmployee,
    isLoading: isCreating,
    error: createError,
  } = useCreateEmployee();

  const {
    mutate: updateEmployee,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateEmployee();

  const {
    mutate: deleteEmployee,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteEmployee();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  function handleFilterSubmit(e) {
    e.preventDefault();
    refetch();
  }

  function clearFilters() {
    setDepartment("");
    setPosition("");
    refetch();
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setProfilePicFile(file || null);
  }

  function startCreateMode() {
    setMode("create");
    setEditingId(null);
    setForm(emptyEmployeeForm);
    setProfilePicFile(null);
    setFormError("");
  }

  function startEditMode(emp) {
    setMode("edit");
    setEditingId(emp._id);
    setForm({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      department: emp.department || "",
      position: emp.position || "",
      salary: emp.salary ?? "",
      dateOfJoining: emp.dateOfJoining
        ? new Date(emp.dateOfJoining).toISOString().slice(0, 10)
        : "",
    });
    setProfilePicFile(null);
    setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.department ||
      !form.position ||
      !form.salary ||
      !form.dateOfJoining
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payload = { ...form, profilePicFile };

    if (mode === "create") {
      createEmployee(payload, {
        onSuccess: () => {
          setForm(emptyEmployeeForm);
          setProfilePicFile(null);
        },
      });
    } else if (mode === "edit" && editingId) {
      updateEmployee(
        { id: editingId, employee: payload },
        {
          onSuccess: () => {
            startCreateMode();
          },
        }
      );
    }
  }

  function handleView(emp) {
    setSelectedEmployee(emp);
  }

  function handleDelete(emp) {
    if (!window.confirm(`Delete employee ${emp.firstName} ${emp.lastName}?`)) {
      return;
    }
    deleteEmployee(emp._id, {
      onSuccess: () => {
        if (selectedEmployee && selectedEmployee._id === emp._id) {
          setSelectedEmployee(null);
        }
        if (mode === "edit" && editingId === emp._id) {
          startCreateMode();
        }
      },
    });
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">
            Manage employees, search, and upload profile pictures.
          </p>
        </div>
        <div className="header-right">
          {user && (
            <span className="user-chip">
              {user.username} ({user.email})
            </span>
          )}
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Optional: Selected employee details */}
      {selectedEmployee && (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
            Employee Details
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {getImageUrl(selectedEmployee.profilePic) ? (
              <img
                src={getImageUrl(selectedEmployee.profilePic)}
                alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                className="employee-avatar"
              />
            ) : (
              <div className="employee-avatar placeholder">
                {selectedEmployee.firstName?.[0]}
                {selectedEmployee.lastName?.[0]}
              </div>
            )}
            <div>
              <div>
                <strong>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </strong>
              </div>
              <div>{selectedEmployee.email}</div>
              <div>
                {selectedEmployee.department} • {selectedEmployee.position}
              </div>
              <div>
                Joined:{" "}
                {selectedEmployee.dateOfJoining
                  ? new Date(
                      selectedEmployee.dateOfJoining
                    ).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add / Edit Employee form */}
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.75rem",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {mode === "create" ? "Add Employee" : "Edit Employee"}
          </h2>
          {mode === "edit" && (
            <button
              type="button"
              className="btn-link"
              onClick={startCreateMode}
            >
              Cancel edit
            </button>
          )}
        </div>

        <form
          className="add-employee-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="form-row">
            <div className="form-group">
              <label>
                First Name<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleFormChange}
                placeholder="e.g. Jaira"
              />
            </div>

            <div className="form-group">
              <label>
                Last Name<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleFormChange}
                placeholder="e.g. Buhain"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Email<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="user@example.com"
              />
            </div>

            <div className="form-group">
              <label>
                Department<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleFormChange}
                placeholder="e.g. IT, HR"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Position<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleFormChange}
                placeholder="e.g. Developer, Manager"
              />
            </div>

            <div className="form-group">
              <label>
                Salary (CAD)<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleFormChange}
                placeholder="e.g. 65000"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Date of Joining<span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={form.dateOfJoining}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Profile Picture (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {formError && <p className="error-text">{formError}</p>}
          {createError && mode === "create" && (
            <p className="error-text">
              Failed to create employee:{" "}
              {createError.response?.data?.message || createError.message}
            </p>
          )}
          {updateError && mode === "edit" && (
            <p className="error-text">
              Failed to update employee:{" "}
                {updateError.response?.data?.message || updateError.message}
            </p>
          )}

          <div className="filters-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isCreating || isUpdating}
            >
              {mode === "create"
                ? isCreating
                  ? "Saving..."
                  : "Save Employee"
                : isUpdating
                ? "Updating..."
                : "Update Employee"}
            </button>
          </div>
        </form>
      </section>

      {/* Filters */}
      <section className="card">
        <form className="filters-form" onSubmit={handleFilterSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. IT, HR, Sales"
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Manager, Developer"
              />
            </div>
          </div>

          <div className="filters-actions">
            <button type="submit" className="btn-primary">
              Apply Filters
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* Employees Table */}
      <section className="card">
        {isLoading && <p>Loading employees...</p>}

        {isError && (
          <p className="error-text">
            Error loading employees: {error.message || "Unknown error"}
          </p>
        )}

        {deleteError && (
          <p className="error-text">
            Failed to delete employee:{" "}
            {deleteError.response?.data?.message || deleteError.message}
          </p>
        )}

        {!isLoading && !isError && (!employees || employees.length === 0) && (
          <p>No employees found. Try adding one or adjusting your filters.</p>
        )}

        {!isLoading && !isError && employees && employees.length > 0 && (
          <div className="table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Date of Joining</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      {getImageUrl(emp.profilePic) ? (
                        <img
                          src={getImageUrl(emp.profilePic)}
                          alt={`${emp.firstName} ${emp.lastName}`}
                          className="employee-avatar"
                        />
                      ) : (
                        <div className="employee-avatar placeholder">
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </div>
                      )}
                    </td>
                    <td>
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>
                      {typeof emp.salary === "number"
                        ? emp.salary.toLocaleString("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          })
                        : emp.salary}
                    </td>
                    <td>
                      {emp.dateOfJoining
                        ? new Date(emp.dateOfJoining).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => handleView(emp)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => startEditMode(emp)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-link"
                          disabled={isDeleting}
                          onClick={() => handleDelete(emp)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default EmployeesPage;
