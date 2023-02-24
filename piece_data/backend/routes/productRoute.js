import Router from "express";
import productController from "../controller/productController.js";
const router = new Router();

router.get("/product", productController.getProducts);
router.post("/product", productController.createProduct);
router.put("/product", productController.changeProduct);
router.delete("/product/:id", productController.deleteProduct);

export default router;
