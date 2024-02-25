import { Request, Response, NextFunction } from "express";
import { deleteImages, uploadImages } from "../libs/cloudinary_operations";
import { IHotel, IImage } from "../types/types";
import { hotelSchema } from "../libs/joiSchemas";
import API_ERROR from "../utils/api_error";
import { UploadApiResponse } from "cloudinary";
import API_RESPONSE from "../utils/api_response";
import Hotel from "../models/hotel";
import API_HOTEL_QUERY_MANAGER from "../utils/api_hotel_query_menager";

export const createHotel = async (req: Request, res: Response) => {
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

  if (reqImages && reqImages.length > 0 && reqImages.length < 6) {
    uploadedImages = await uploadImages(reqImages);
    createdHotel.imgs = uploadedImages.map((img) => {
      return {
        publicId: img.public_id,
        imageUrl: img.url,
      };
    });
  }

  await createdHotel.save();

  return new API_RESPONSE(
    {
      hotel: createdHotel,
    },
    "Hotel is created successfully"
  ).created(res);
};

export const searchHotel = async (req: Request, res: Response) => {
  const hotelQuery = new API_HOTEL_QUERY_MANAGER(req);
  const data = await hotelQuery.sortAndPaginate();

  return new API_RESPONSE(data, "Hotels is received").success(res);
};

export const getHotel = async (req: Request, res: Response) => {
  const hotelId = req.params.hotelId as string;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new API_ERROR("Hotel not found", 404);
  }

  return new API_RESPONSE({ hotel }, "Hotel is received").success(res);
};

export const updateHotel = async (req: Request, res: Response) => {
  const hotelId = req.params.hotelId as string;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new API_ERROR("Hotel not found", 404);
  }
  if (hotel.userId !== req.userId) {
    throw new API_ERROR("You are not authorized to update this hotel", 403);
  }

  if (req.body.facilities && typeof req.body.facilities === "string") {
    req.body.facilities = req.body.facilities.split(",");
  }
  const updates: Partial<IHotel> = req.body;
  
  const newImages = req.files as Express.Multer.File[];
  let uploadedImages: UploadApiResponse[];
  

  if (req.body.imagesToDelete) {
    req.body.imagesToDelete = req.body.imagesToDelete.split(",");
    await deleteImages(req.body.imagesToDelete as Array<string>);
    hotel.imgs = hotel.imgs.filter((img) => !req.body.imagesToDelete.includes(img.publicId));
  }

  if (newImages && newImages.length > 0) {
    uploadedImages = await uploadImages(newImages);
    hotel.imgs = [
      ...hotel.imgs,
      ...uploadedImages.map((img) => {
        return {
          publicId: img.public_id,
          imageUrl: img.url,
        } as IImage;
      }),
    ];
  }

  hotel.set(updates);
  await hotel.save();
  return new API_RESPONSE({ hotel }, "Hotel is updated").success(res);
};
