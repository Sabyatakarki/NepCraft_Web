import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploads } from "../middleware/upload.middleware"; // your multer setup
import { authorizedMiddleware } from "../middleware/authorized.middlware";

const router = Router();
const authController = new AuthController();

// Register & Login
router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/request-password-reset", authController.sendResetPasswordEmail);
router.post("/reset-password/:token", authController.resetPassword);

// Update profile with profile picture
// 'profilePicture' is the field name sent from Flutter
router.post(
  "/update-profile",
  uploads.profile.single("profilePicture"), // <-- use profile namespace
  authorizedMiddleware,
  authController.updateProfile
);

export default router;