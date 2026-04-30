import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/usersRoute.js";
import apisRoute from "./routes/apisRoute.js";
import apikeysRoute from "./routes/apikeysRoute.js";
import apiGatewayRoute from "./routes/apiGatewayRoute.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["*"];

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
app.use(cors(corsOptions));

//
app.use("/flowcharge/users", usersRoute);
app.use("/flowcharge/apis", apisRoute);
app.use("/flowcharge/apikeys", apikeysRoute);
app.use("/", apiGatewayRoute);
export default app;
