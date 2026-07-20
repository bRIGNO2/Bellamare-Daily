import { Router } from "express";
import * as authController from "../controllers/authController";
import { requireClientAuth } from "../middleware/authClient";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.get("/me", requireClientAuth, asyncHandler(authController.me));
router.put("/me", requireClientAuth, asyncHandler(authController.updateMe));
router.post("/logout", requireClientAuth, asyncHandler(authController.logout));

export default router;
