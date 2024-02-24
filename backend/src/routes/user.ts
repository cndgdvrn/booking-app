import express from "express"
import { getMe } from "../controllers/user_controller"
import { verify_token } from "../middlewares/verify_token"

const router = express.Router() 

router.get("/me",verify_token,getMe)












export default router