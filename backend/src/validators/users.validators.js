import { body } from "express-validator";

export const signupValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("username is required")
    .isLength({ min: 3, max: 50 }).withMessage("username must be 3-50 chars"),

  body("email")
    .trim()
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("email must be valid")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 6 }).withMessage("password must be at least 6 chars"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("email must be valid")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("password is required"),
];
