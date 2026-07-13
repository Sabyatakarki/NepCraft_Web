import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploads } from "../middleware/upload.middleware";
import { authorizedMiddleware } from "../middleware/authorized.middlware";

const router = Router();
const authController = new AuthController();

// Register & Login
router.post("/register", authController.register);
router.post("/login", authController.login);

// Get logged-in user profile
router.get(
  "/profile",
  authorizedMiddleware,
  authController.getProfile
);

// Update profile
router.post(
  "/update-profile",
  authorizedMiddleware,
  uploads.profile.single("profilePicture"),
  authController.updateProfile
);

export default router;