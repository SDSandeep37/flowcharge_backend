import express from "express";
import { createCheckoutSession } from "../controllers/paymentsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route (user must be logged in)
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

export default router;
