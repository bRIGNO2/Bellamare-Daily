import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { requireClientAuth } from "../middleware/authClient";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireClientAuth);
router.post("/", asyncHandler(orderController.createOrder));
router.get("/my", asyncHandler(orderController.getMyOrders));
router.get("/:id", asyncHandler(orderController.getOrder));
router.delete("/:id", asyncHandler(orderController.cancelOrder));

export default router;
