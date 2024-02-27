import { Request, Response } from "express";
import Hotel from "../models/hotel";
import API_ERROR from "../utils/api_error";
import User from "../models/user";
import Booking from "../models/booking";
import { IBookingRequest } from "../types/types";
import stripe from "stripe";
import API_RESPONSE from "../utils/api_response";
import { buffer } from "micro";

const stripeClient = new stripe(process.env.STRIPE_API_KEY as string);

export const createBooking = async (req: Request, res: Response) => {
  const hotelId: string = req.params.hotelId;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new API_ERROR("Hotel not found", 404);
  }

  const userId = req.userId as string;

  const user = await User.findById(userId);

  if (!user) {
    throw new API_ERROR("Authentication error in createBooking controller", 403);
  }

  const bookingBody: IBookingRequest = req.body;
  const checkInDate = new Date(bookingBody.checkIn);
  const checkOutDate = new Date(bookingBody.checkOut);
  const daysStaying = Math.ceil(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
  const totalCost = (bookingBody.adultCount * 1 + bookingBody.childCount * 0.5) * hotel.pricePerNight * daysStaying;

  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: totalCost * 100,
    currency: "usd",
    metadata: {
      hotelId,
      userId,
    },
  });

  const booking = new Booking({
    userId: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    adultCount: bookingBody.adultCount,
    childCount: bookingBody.childCount,
    checkIn: bookingBody.checkIn,
    checkOut: bookingBody.checkOut,
    totalCost,
    status: "pending",
    paymentIntentId: paymentIntent?.id || "",
  });

  const savedBooking = await booking.save();

  if (!paymentIntent.client_secret) {
    throw new API_ERROR("Payment intent creation failed", 500);
  }

  const response = {
    booking: savedBooking,
    payment: {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    },
  };
  return new API_RESPONSE(
    response,
    `Booking successfully created with payment intent - Payment status = ${booking.status} `
  ).created(res);
};

export const stripeWebHook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const buf = await buffer(req);
  let event;

  

  try {
    event = stripeClient.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (e) {
    console.log("WEB HOOK ERROR", e);
    throw new API_ERROR("Webhook error", 400);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as stripe.PaymentIntent;
    const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
    if (!booking) {
      throw new API_ERROR("Booking not found", 400);
    }

    booking.status = "approved";
    await booking.save();

    return new API_RESPONSE(
      booking,
      `Payment for the reservation was successful. - Payment status = ${booking.status} `
    ).success(res);
  } else {
    res.json({ received: true });
  }
};


