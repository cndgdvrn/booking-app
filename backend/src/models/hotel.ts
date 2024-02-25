import mongoose from "mongoose";
import { IHotel } from "../types/types";
import { bookingSchema } from "./booking";

const hotelSchema = new mongoose.Schema<IHotel>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
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
    facilities: [{ type: String, required: true }],

    pricePerNight: {
      type: Number,
      required: true,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    imgs: [
      {
        _id:false,
        publicId: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
      },
    ],
    bookings: [bookingSchema],
  },
  {
    versionKey: false,
    collection: "Hotels",
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
