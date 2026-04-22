import express from "express";
import {
  createAdmin,
  createUserController,
  createUserOwner,
  getUserByIdContoller,
  loginController,
} from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

//
router.post("/", createUserController);
router.post("/create/admin", createAdmin);
router.post("/login", loginController);

router.post("/create", verifyToken, createUserOwner);
router.get("/session", verifyToken, getUserByIdContoller);

export default router;
