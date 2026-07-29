import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploads } from "../middleware/upload.middleware";
import { authorizedMiddleware } from "../middleware/authorized.middlware";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);


router.get(
  "/profile",
  authorizedMiddleware,
  authController.getProfile
);

router.post(
  "/update-profile",
  authorizedMiddleware,
  uploads.profile.single("profilePicture"),
  authController.updateProfile
);

export default router;