import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createApiController } from "../controllers/apisController.js";
const router = express.Router();

//
router.post("/", verifyToken, createApiController);

export default router;
