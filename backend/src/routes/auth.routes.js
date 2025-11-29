import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { handleValidation } from "../middleware/validate.js";
import {
  signupValidator,
  loginValidator,
} from "../validators/users.validators.js";

const r = Router();

r.post("/signup", signupValidator, handleValidation, signup);
r.post("/login", loginValidator, handleValidation, login);

export default r;
