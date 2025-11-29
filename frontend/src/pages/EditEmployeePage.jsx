import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../apiClient";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";

function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/emp/employees/${id}`);
      return res.data;
    },
  });

  const { mutate: updateEmployee, isLoading: saving, error } =
    useUpdateEmployee();

  const [form, setForm] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      firstName: form.firstName ?? emp.firstName,
      lastName: form.lastName ?? emp.lastName,
      email: form.email ?? emp.email,
      department: form.department ?? emp.department,
      position: form.position ?? emp.position,
      salary: form.salary ?? emp.salary,
      dateOfJoining:
        form.dateOfJoining ??
        (emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : ""),
      profilePicFile,
    };

    updateEmployee(
      { id, employee: payload },
      {
        onSuccess: () => navigate(`/employees/${id}`),
      }
    );
  }

  if (isLoading) return <p className="page">Loading employee...</p>;
  if (isError || !emp) return <p className="page">Error fetching employee.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Employee</h1>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="add-employee-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                defaultValue={emp.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                defaultValue={emp.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                defaultValue={emp.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                name="department"
                defaultValue={emp.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Position</label>
              <input
                name="position"
                defaultValue={emp.position}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Salary (CAD)</label>
              <input
                name="salary"
                type="number"
                defaultValue={emp.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Joining</label>
              <input
                name="dateOfJoining"
                type="date"
                defaultValue={
                  emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : ""
                }
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
              />
            </div>
          </div>

          {error && (
            <p className="error-text">
              Failed to update employee:{" "}
              {error.response?.data?.message || error.message}
            </p>
          )}

          <button className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeePage;
