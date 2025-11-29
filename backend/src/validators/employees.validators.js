import { body, param, query } from "express-validator";

export const createEmployeeValidator = [
  body("firstName").trim().notEmpty().withMessage("firstName is required"),
  body("lastName").trim().notEmpty().withMessage("lastName is required"),
  body("email").trim().isEmail().withMessage("valid email is required"),
  body("position").trim().notEmpty().withMessage("position is required"),
  body("department").trim().notEmpty().withMessage("department is required"),
  body("salary").isNumeric().withMessage("salary must be a number"),
  body("dateOfJoining").isISO8601().withMessage("dateOfJoining must be a valid date"),
];

export const putEmployeeValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
  ...createEmployeeValidator,
];

export const patchEmployeeValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
];

export const getEmployeeValidator = [
  param("id").isMongoId().withMessage("id must be a valid Mongo ObjectId"),
];

export const deleteByQueryValidator = [
  query("eid").isMongoId().withMessage("eid must be a valid Mongo ObjectId"),
];
