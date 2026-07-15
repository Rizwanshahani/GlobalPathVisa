import express from "express";
import {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/")
    .post(isAuthenticated, createOrder);

router.route("/myorders")
    .get(isAuthenticated, getMyOrders);

router.route("/allorders")
    .get(isAuthenticated, isAdmin, getAllOrders);

router.route("/:id")
    .get(isAuthenticated, getOrderById);

router.route("/:id/status")
    .put(isAuthenticated, isAdmin, updateOrderStatus);

export default router;
