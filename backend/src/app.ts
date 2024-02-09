import "express-async-errors";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

import cors from "cors";
import "dotenv/config";
import "./config/db";
import router from "./routes";
import { error_handler } from "./middlewares/error_handler";
import morgan from "morgan";
import { corsOptionsDelegate } from "./utils/cors_options";
// console.log(process.env.NODE_ENV);

const app = express();

app.use(morgan("tiny"));
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());



app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(error_handler);

app.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING");
});
