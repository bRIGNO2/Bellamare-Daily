import { Router } from "express";
import * as newspaperController from "../controllers/newspaperController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(newspaperController.listActive));

export default router;
