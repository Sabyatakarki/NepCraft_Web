import express from "express";
import {
  getProducts,
  createProduct,
  getProductById
} from "../controllers/Product.controller";

import { uploads } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  uploads.product.single("image"),
  createProduct
);


export default router;