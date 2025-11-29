import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../apiClient";
import useDeleteEmployee from "../hooks/useDeleteEmployee";

function DeleteEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/emp/employees/${id}`);
      return res.data;
    },
  });

  const { mutate: deleteEmployee, isLoading: deleting, error } =
    useDeleteEmployee();

  function handleDelete() {
    deleteEmployee(id, {
      onSuccess: () => navigate("/employees"),
    });
  }

  if (isLoading) return <p className="page">Loading employee...</p>;
  if (isError || !emp) return <p className="page">Error fetching employee.</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Delete Employee</h1>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card">
        <p>
          Are you sure you want to delete{" "}
          <strong>
            {emp.firstName} {emp.lastName}
          </strong>
          ?
        </p>

        {error && (
          <p className="error-text">
            Failed to delete employee:{" "}
            {error.response?.data?.message || error.message}
          </p>
        )}

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button
            className="btn-primary"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEmployeePage;
