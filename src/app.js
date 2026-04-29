import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/usersRoute.js";
import apisRoute from "./routes/apisRoute.js";
import apikeysRoute from "./routes/apikeysRoute.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

//
app.use("/flowcharge/users", usersRoute);
app.use("/flowcharge/apis", apisRoute);
app.use("/flowcharge/apikeys", apikeysRoute);

export default app;
