import mongoose from "mongoose";
import createError from "http-errors";
import { Employee } from "../models/Employee.js";

function buildEmployeeData(req) {
  const data = { ...req.body };
  if (data.salary !== undefined) {
    data.salary = Number(data.salary);
  }
  if (req.file) {
    data.profilePic = `/uploads/${req.file.filename}`;
  }
  return data;
}

// POST /api/v1/emp/employees
export async function createEmployee(req, res, next) {
  try {
    const data = buildEmployeeData(req);
    const emp = await Employee.create(data);
    res.status(201).json(emp);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/emp/employees
export async function listEmployees(req, res, next) {
  try {
    const { dept, q, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (dept) filter.department = dept;
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { position: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Employee.countDocuments(filter),
    ]);

    res.status(200).json({
      data: items,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/emp/employees/:id
export async function getEmployee(req, res, next) {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) throw createError(404, "Employee not found");
    res.status(200).json(emp);
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/emp/employees/:id
export async function updateEmployeePut(req, res, next) {
  try {
    const data = buildEmployeeData(req);

    const emp = await Employee.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
      overwrite: true,
    });

    if (!emp) throw createError(404, "Employee not found");
    res.status(200).json(emp);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/emp/employees/:id
export async function updateEmployeePatch(req, res, next) {
  try {
    const data = buildEmployeeData(req);

    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!emp) throw createError(404, "Employee not found");
    res.status(200).json(emp);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/emp/employees?eid=...
export async function deleteEmployeeByQuery(req, res, next) {
  try {
    const { eid } = req.query;

    if (!mongoose.isValidObjectId(eid)) {
      return res.status(400).json({
        error: "InvalidId",
        message: "eid must be a valid Mongo ObjectId",
      });
    }

    const removed = await Employee.findByIdAndDelete(eid);
    if (!removed) throw createError(404, "Employee not found");

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/emp/employees/search?department=...&position=...
export async function searchEmployees(req, res, next) {
  try {
    const { department, position } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter).sort({
      lastName: 1,
      firstName: 1,
    });

    res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
}
