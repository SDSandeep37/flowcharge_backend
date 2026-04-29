import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createApiKeyController } from "../controllers/apikeysController.js";

const router = express.Router();

//
router.post("/", verifyToken, createApiKeyController);

export default router;
