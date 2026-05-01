import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getBillingsByApiAndUserIdController } from "../controllers/billingsController.js";

const router = express.Router();

router.get("/:api_id", verifyToken, getBillingsByApiAndUserIdController);

export default router;
