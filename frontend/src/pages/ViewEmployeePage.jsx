import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../apiClient";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

function getImageUrl(profilePic) {
  if (!profilePic) return null;
  if (profilePic.startsWith("http")) return profilePic;
  const base = API_BASE.replace(/\/api\/v1\/?$/, "");
  return `${base}${profilePic}`;
}

function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/emp/employees/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="page">Loading employee...</p>;
  if (isError || !emp)
    return <p className="page">Error fetching employee.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Employee Details</h1>
        <button className="btn-secondary" onClick={() => navigate("/employees")}>
          Back to list
        </button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {getImageUrl(emp.profilePic) ? (
            <img
              src={getImageUrl(emp.profilePic)}
              alt={`${emp.firstName} ${emp.lastName}`}
              style={{ width: 120, height: 120, borderRadius: "999px", objectFit: "cover" }}
            />
          ) : (
            <div className="employee-avatar placeholder">
              {emp.firstName?.[0]}
              {emp.lastName?.[0]}
            </div>
          )}

          <div>
            <h2 style={{ margin: 0 }}>
              {emp.firstName} {emp.lastName}
            </h2>
            <div>{emp.email}</div>
            <div>
              {emp.department} • {emp.position}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <p>
            <strong>Salary:</strong> {emp.salary}
          </p>
          <p>
            <strong>Date of Joining:</strong>{" "}
            {emp.dateOfJoining
              ? new Date(emp.dateOfJoining).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
          <button
            className="btn-primary"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/employees/${id}/delete`)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployeePage;
