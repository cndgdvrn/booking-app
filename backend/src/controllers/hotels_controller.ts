import { Request, Response, NextFunction } from "express";
import { uploadImages } from "../libs/upload_images";
import { IHotel } from "../types/types";
import { hotelSchema } from "../libs/joiSchemas";
import API_ERROR from "../utils/api_error";
import { UploadApiResponse } from "cloudinary";
import API_RESPONSE from "../utils/api_response";
import Hotel from "../models/hotel";
import API_HOTEL_QUERY_MANAGER from "../utils/api_hotel_query_menager";

export const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  req.body.facilities = req.body.facilities.split(",");
  const newHotel = req.body as IHotel;
  const { error } = hotelSchema.validate(newHotel);
  if (error) {
    throw new API_ERROR(error.details[0].message, 400);
  }

  let uploadedImages: UploadApiResponse[];

  const createdHotel = new Hotel(newHotel);
  createdHotel.userId = req.userId as string;

  const reqImages = req.files as Express.Multer.File[];

  if (reqImages.length > 0 && reqImages.length < 6) {
    uploadedImages = await uploadImages(reqImages);
    createdHotel.imageUrls = uploadedImages.map((image) => image.url);
  }

  await createdHotel.save();

  return new API_RESPONSE(
    {
      hotel: createdHotel,
    },
    "Hotel is created successfully"
  ).created(res);
};

export const getHotel = async (req: Request, res: Response, next: NextFunction) => {
  const hotelQuery = new API_HOTEL_QUERY_MANAGER(req);
  const data = await hotelQuery.sortAndPaginate();

  return new API_RESPONSE(data, "Hotels is received").success(res);
};
