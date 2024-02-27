import express from 'express';
import auth from "./auth"
import hotels from "./hotels"
import user from "./user"
import booking from "./booking"

const router = express.Router()


router.use("/auth",auth)
router.use("/hotel",hotels)
router.use("/user",user)
router.use("/booking",booking)




export default router;