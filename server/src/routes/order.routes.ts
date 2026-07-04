import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,

} from "../controllers/order.controller";

import {
  authorizedMiddleware,
  
} from "../middleware/authorized.middlware";

const router = express.Router();

// User Routes
router.post("/",authorizedMiddleware,createOrder);

router.get("/my-orders", authorizedMiddleware, getMyOrders);

router.get("/:id", authorizedMiddleware, getOrderById);

export default router;