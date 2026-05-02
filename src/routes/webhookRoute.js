import express from "express";
import { stripeWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// IMPORTANT: raw body (NOT json)
router.post("/", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
