import express from "express";
import { apiGateway } from "../middlewares/apiGatewayMiddleware.js";

const router = express.Router();

//
// router.get("/*", apiGateway);
router.use(apiGateway);

export default router;
