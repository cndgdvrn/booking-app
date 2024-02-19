import express from 'express';
import auth from "./auth"
import hotels from "./hotels"

const router = express.Router()


router.use("/auth",auth)
router.use("/hotels",hotels)




export default router;