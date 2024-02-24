import express  from "express"
import { createHotel, getHotel } from "../controllers/hotels_controller"
import { upload } from "../libs/multer"
import { verify_token } from "../middlewares/verify_token"

const router = express.Router()


// Create Hotel
router.post("/",verify_token,upload.array("hotel-images",12),createHotel)

//Search Hotel
router.get("/search",getHotel)

export default router