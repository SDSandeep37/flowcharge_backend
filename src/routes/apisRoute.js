import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createApiController,
  getAllApisController,
  getApiWithBaseUrlController,
} from "../controllers/apisController.js";
const router = express.Router();

//
router.post("/", verifyToken, createApiController);
router.get("/", verifyToken, getAllApisController);
router.get("/base-url", verifyToken, getApiWithBaseUrlController);

export default router;
