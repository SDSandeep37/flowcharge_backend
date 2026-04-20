import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/usersRoute.js";

const app = express();

// middlewares
app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "http://10.16.0.240:3000"];
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
export default app;
