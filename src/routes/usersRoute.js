import express from "express";
import {
  createAdmin,
  createUserController,
  createUserOwner,
  getAllConsumersController,
  getAllOwnersController,
  getUserByIdContoller,
  loginController,
  logoutController,
} from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

//
router.post("/", createUserController);
router.post("/create/admin", createAdmin);
router.post("/login", loginController);

router.post("/create", verifyToken, createUserOwner);
router.get("/session", verifyToken, getUserByIdContoller);
router.get("/owners", verifyToken, getAllOwnersController);
router.get("/consumers", verifyToken, getAllConsumersController);
router.post("/logout", verifyToken, logoutController);

export default router;
