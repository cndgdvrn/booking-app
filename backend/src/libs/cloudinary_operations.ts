import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import API_ERROR from "../utils/api_error";
import { IImage } from "../types/types";

export const uploadImages = (images: Express.Multer.File[]): Promise<Array<UploadApiResponse>> => {
  const uploadPromises = images.map((image) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = image.originalname.split(".")[0];
      const public_id = `${fileName}-${uniqueSuffix}`;
      cloudinary.uploader
        .upload_stream({ resource_type: "image", public_id }, (error, result) => {
          if (error) reject(error);
          else if (result) {
            resolve(result);
          } else {
            reject(new API_ERROR("Cloudinary upload process failed without an error", 400));
          }
        })
        .end(image.buffer);
    });
  });

  return Promise.all(uploadPromises);
};

export const deleteImages = (images: Array<string>) => {
  const deletionPromises = images.map((image) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(image, (err, result) => {
        if (err) {
          reject(err);
        } else if (result) {
          resolve(result);
        } else {
          reject(new API_ERROR("Cloudinary deletion process failed without an error", 400));
        }
      });
    });
  });
  return Promise.all(deletionPromises);
};
