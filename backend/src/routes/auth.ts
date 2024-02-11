import express from "express";
import { login, logout, register, validateToken } from "../controllers/auth_controller";
import { verify_token } from "../middlewares/verify_token";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout",logout)

router.get("/validate-token", verify_token, validateToken);


export default router;
