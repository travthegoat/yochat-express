import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';
import { usersRouter } from "./routes/users.route.js";

const app = express();

// MIDDLEWARE //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(cookieParser());

// HEALTH CHECK //
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// ROUTES //
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// ERROR HANDLER //
app.use(errorHandler);

export default app;