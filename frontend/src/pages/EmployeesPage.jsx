import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";

function EmployeesPage() {
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Local UI state for filters
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const { data: employees, isLoading, isError, error, refetch } = useEmployees({
    department: department || undefined,
    position: position || undefined,
  });

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  function handleSubmitFilters(e) {
    e.preventDefault();
    // React Query already refetches when key changes,
    // but we can also call refetch if needed.
    refetch();
  }

  function clearFilters() {
    setDepartment("");
    setPosition("");
    refetch();
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">
            View and search employees by department or position.
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

      {/* Search / Filters */}
      <section className="card">
        <form className="filters-form" onSubmit={handleSubmitFilters}>
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

      {/* Employee list */}
      <section className="card">
        {isLoading && <p>Loading employees...</p>}

        {isError && (
          <p className="error-text">
            Error loading employees: {error.message || "Unknown error"}
          </p>
        )}

        {!isLoading && !isError && (!employees || employees.length === 0) && (
          <p>No employees found. Try adjusting your filters.</p>
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
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      {emp.profilePic ? (
                        <img
                          src={emp.profilePic}
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
