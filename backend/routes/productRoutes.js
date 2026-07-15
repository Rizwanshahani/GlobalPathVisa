import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} from "../controllers/productController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/")
    .get(getProducts)
    .post(isAuthenticated, isAdmin, createProduct);

router.route("/:id")
    .get(getProductById)
    .put(isAuthenticated, isAdmin, updateProduct)
    .delete(isAuthenticated, isAdmin, deleteProduct);

router.route("/:id/reviews")
    .post(isAuthenticated, createProductReview);

export default router;
