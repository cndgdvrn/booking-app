import express  from "express"
import { createHotel } from "../controllers/hotels_controller"
import { upload } from "../libs/multer"
import { verify_token } from "../middlewares/verify_token"

const router = express.Router()


// Create Hotel
router.post("/",verify_token,upload.array("hotel-images",12),createHotel)

export default router