import { Router } from "express";
import {
  createEmployee,
  listEmployees,
  getEmployee,
  updateEmployeePut,
  updateEmployeePatch,
  deleteEmployeeByQuery,
  searchEmployees,
} from "../controllers/employees.controller.js";
import { authRequired } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import {
  createEmployeeValidator,
  putEmployeeValidator,
  patchEmployeeValidator,
  getEmployeeValidator,
  deleteByQueryValidator,
} from "../validators/employees.validators.js";
import { upload } from "../middleware/upload.js";

const r = Router();

// Search by dept/position
r.get("/employees/search", authRequired, searchEmployees);

// List all
r.get("/employees", authRequired, listEmployees);

// Create (with optional profilePic)
r.post(
  "/employees",
  authRequired,
  upload.single("profilePic"),
  createEmployeeValidator,
  handleValidation,
  createEmployee
);

// Get by ID
r.get(
  "/employees/:id",
  authRequired,
  getEmployeeValidator,
  handleValidation,
  getEmployee
);

// Full update
r.put(
  "/employees/:id",
  authRequired,
  upload.single("profilePic"),
  putEmployeeValidator,
  handleValidation,
  updateEmployeePut
);

// Partial update
r.patch(
  "/employees/:id",
  authRequired,
  upload.single("profilePic"),
  patchEmployeeValidator,
  handleValidation,
  updateEmployeePatch
);

// Delete by ?eid=
r.delete(
  "/employees",
  authRequired,
  deleteByQueryValidator,
  handleValidation,
  deleteEmployeeByQuery
);

export default r;
