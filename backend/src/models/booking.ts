import mongoose from "mongoose";
import { IBooking } from "../types/types";

export const bookingSchema = new mongoose.Schema<IBooking>(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    adultCount: {
      type: Number,
      required: true,
    },
    childCount: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      required: true,
    },
    paymentIntentId: {
      type: String,
    }
  },
  {
    versionKey: false,
    collection: "Booking",
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
