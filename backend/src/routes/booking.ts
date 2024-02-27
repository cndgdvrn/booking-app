import express from "express";
import { createBooking, stripeWebHook } from "../controllers/booking_controller";
import { verify_token } from "../middlewares/verify_token";

const router = express.Router();

// Create a booking
router.post("/:hotelId", verify_token, createBooking);

//stripe web hook
router.post("/webhooks/stripe",express.raw({type:"application/json"}),stripeWebHook)


export default router;
