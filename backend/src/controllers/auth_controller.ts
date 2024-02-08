import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import API_ERROR from "../utils/api_error";
import { registerSchema } from "../validations/validationSchemas";
import API_RESPONSE from "../utils/api_response";
import { IUser } from "../types/types";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    throw new API_ERROR(error.details[0].message, 400, "Validation Error");
  }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new API_ERROR("User already exists", 400);
  }

  const user = new User(req.body);
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  await user.save();
  return new API_RESPONSE<Partial<IUser>>(
    user,
    "Registiration successfull"
  ).created(res);
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  
}
