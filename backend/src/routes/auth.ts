import express from "express"
import { register } from "../controllers/auth_controller";

const router = express.Router()


router.post("/register",register)



export default router;