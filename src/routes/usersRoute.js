import express from "express";
import {
  createAdmin,
  createUserController,
  createUserOwner,
  loginController,
} from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

//
router.post("/", createUserController);
router.post("/create/admin", createAdmin);
router.post("/create", verifyToken, createUserOwner);
router.post("/login", loginController);

export default router;
