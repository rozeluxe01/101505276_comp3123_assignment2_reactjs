import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeesPage from "./pages/EmployeesPage";
import ViewEmployeePage from "./pages/ViewEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";
import DeleteEmployeePage from "./pages/DeleteEmployeePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <ViewEmployeePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute>
              <EditEmployeePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id/delete"
          element={
            <ProtectedRoute>
              <DeleteEmployeePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
