import { Request, Response } from "express";
import Hotel from "../models/hotel";
import API_ERROR from "../utils/api_error";
import User from "../models/user";
import Booking from "../models/booking";
import { IBookingRequest } from "../types/types";
import stripe from "stripe";
import API_RESPONSE from "../utils/api_response";
import { buffer } from "micro";
import { createBookingSchema } from "../libs/joi_schemas";

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
  const { error } = createBookingSchema.validate(bookingBody);

  if (error) {
    throw new API_ERROR(error.details[0].message, 400);
  }

  const checkInDate = new Date(bookingBody.checkIn);
  const checkOutDate = new Date(bookingBody.checkOut);
  const daysStaying = Math.ceil(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
  const totalCost =
    (bookingBody.adultCount * 1 + bookingBody.childCount * 0.5) * hotel.pricePerNight * (daysStaying + 1);

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

  hotel.bookings.push({ bookingId: booking._id.toString() });
  await hotel.save();
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

  let event;

  try {
    const buf = await buffer(req);
    event = stripeClient.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (e: any) {
    console.log("WEB HOOK ERROR", e);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as stripe.PaymentIntent;

    try {
      const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
      if (!booking) {
        console.log("Booking not found for paymentIntentId:", paymentIntent.id);
        return res.status(200).send();
      }

      booking.status = "approved";
      await booking.save();

      console.log(`Payment for the reservation was successful. - Payment status = ${booking.status}`);
      return res.json({ received: true });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return res.status(200).send();
    }
  } else {
    console.log(`Unhandled payment intent status: ${event.type}`);
    return res.status(200).json({ received: true, note: "Unhandled event type" });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const hotelId = req.body.hotelId as string;
  const userId = req.userId as string;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new API_ERROR("Booking not found", 404);
  }
  if (!booking.paymentIntentId) {
    throw new API_ERROR("Payment intent not found", 404);
  }
  const paymentIntent = await stripeClient.paymentIntents.retrieve(booking.paymentIntentId);

  if (paymentIntent.metadata.hotelId !== hotelId || paymentIntent.metadata.userId !== userId) {
    throw new API_ERROR("Payment intent mismatch", 400);
  }
  if (paymentIntent.status !== "succeeded") {
    throw new API_ERROR(
      `Payment intent status is not succeeded - Payment intent status : ${paymentIntent.status}`,
      400
    );
  }
  booking.status = "approved";
  await booking.save();

  // TODO: Email actions will be added here

  return new API_RESPONSE({ booking }, "Booking confirmed successfully").success(res);
};
