import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import API_ERROR from "../utils/api_error";
import API_RESPONSE from "../utils/api_response";
import { IUser } from "../types/types";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../libs/joi_schemas";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    throw new API_ERROR(error.details[0].message, 400, "Validation Error");
  }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new API_ERROR("User already exists", 400);
  }

  const user = new User(req.body);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  await user.save();
  return new API_RESPONSE<Partial<IUser>>(user, "Registiration successfull").created(res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  await loginSchema.validateAsync(req.body);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new API_ERROR("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new API_ERROR("Invalid credentials", 400);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  return new API_RESPONSE<Partial<IUser>>(user, "Login successfull").success(res);
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("auth_token", {
    expires: new Date(0),
  });
  return new API_RESPONSE(undefined, "Logout successfull").success(res);
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  return new API_RESPONSE({ userId: req.userId }, "Token is valid").success(res);
};
