import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getLogsByApiAndUserIdController } from "../controllers/usageLogsController.js";

const router = express.Router();

router.get("/:api_id", verifyToken, getLogsByApiAndUserIdController);

export default router;
