import { Router } from "express";
import { login, logout, signup, checkAuth } from "../controllers/authController.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/check", protectedRoute, checkAuth);

router.get("/logout", protectedRoute, logout);






export default router;
