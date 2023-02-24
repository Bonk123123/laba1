import Router from "express";
import userController from "../controller/userController.js";
const router = new Router();

router.get("/user", userController.getUsers);
router.post("/user", userController.createUser);
router.put("/user", userController.changeUser);
router.delete("/user/:id", userController.deleteUser);

export default router;
