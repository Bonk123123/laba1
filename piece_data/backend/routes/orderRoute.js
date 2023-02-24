import Router from "express";
import orderController from "../controller/orderController.js";
const router = new Router();

router.post("/order", orderController.createOrder);
router.get("/order", orderController.getOrders);
router.delete("/order/:id", orderController.deleteOrders);

export default router;
