import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { validate } from "../../../common/middleware/validate";
import {
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);
router.post("/logout", authenticate, validate(logoutSchema), logout);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
