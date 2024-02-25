import "express-async-errors";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import "./config/db";
import router from "./routes";
import { error_handler } from "./middlewares/error_handler";
import morgan from "morgan";
import path from "path";
import { corsOptionsDelegate } from "./libs/cors_options";
import { v2 as cloudinary } from "cloudinary";
import { upload } from "./libs/multer";

// console.log(process.env.NODE_ENV );

const app = express();

// app.use(express.static(path.join(__dirname,"../../frontend/dist")))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



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
