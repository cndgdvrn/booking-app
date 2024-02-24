import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import API_ERROR from "../utils/api_error";

const storage = multer.memoryStorage();
const allowedMimetypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const isAllowed = allowedMimetypes.includes(file.mimetype);
  if (isAllowed) {
    cb(null, true);
    return;
  }

  cb(new API_ERROR("File must be in png, jpeg, jpg or gif format.", 400));
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 12,
  },
  fileFilter
});
