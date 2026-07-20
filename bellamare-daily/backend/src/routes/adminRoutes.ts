import { Router } from "express";
import * as adminAuthController from "../controllers/adminAuthController";
import * as customerController from "../controllers/customerController";
import * as newspaperController from "../controllers/newspaperController";
import * as orderController from "../controllers/orderController";
import * as paymentController from "../controllers/paymentController";
import * as reportController from "../controllers/reportController";
import { requireAdminAuth } from "../middleware/authAdmin";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Auth (pubblica)
router.post("/login", asyncHandler(adminAuthController.login));

// Da qui in poi tutto richiede autenticazione admin
router.use(requireAdminAuth);

router.get("/me", asyncHandler(adminAuthController.me));
router.post("/logout", asyncHandler(adminAuthController.logout));

router.get("/dashboard", asyncHandler(reportController.dashboard));
router.get("/shopping-list", asyncHandler(reportController.shoppingList));
router.get("/delivery-list", asyncHandler(reportController.deliveryList));
router.post("/delivery/:orderId/delivered", asyncHandler(reportController.markDelivered));
router.post("/delivery/:orderId/not-delivered", asyncHandler(reportController.markNotDelivered));

router.get("/orders", asyncHandler(orderController.listOrdersAdmin));
router.patch("/orders/:id/status", asyncHandler(orderController.updateOrderStatusAdmin));

router.get("/payments", asyncHandler(paymentController.listPending));
router.get("/payments/history", asyncHandler(paymentController.history));
router.post("/payments/:orderId/mark-paid", asyncHandler(paymentController.markPaid));

router.get("/newspapers", asyncHandler(newspaperController.listAll));
router.post("/newspapers", asyncHandler(newspaperController.create));
router.put("/newspapers/:id", asyncHandler(newspaperController.update));

router.get("/customers", asyncHandler(customerController.search));

export default router;
