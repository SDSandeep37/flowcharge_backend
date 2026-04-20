import express from "express";
import {
  createUserController,
  loginController,
} from "../controllers/usersController.js";

const router = express.Router();

//
router.post("/", createUserController);
router.post("/login", loginController);

export default router;
