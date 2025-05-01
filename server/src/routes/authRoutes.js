import { Router } from "express";
import { login, logout, signup, checkAuth,  } from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);

router.post("/login",loginLimiter, login);

router.post("/google", google);

router.get("/verify-email", verifyEmail);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);

router.post("/forget", forget);

router.post("/reset/:token", reset);

router.get("/check", protectedRoute, checkAuth);

router.post("/send-verification", sendVerification)

router.delete("/delete-account",protectedRoute,  deleteAccount);

export default router;
