import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import API_ERROR from "../utils/api_error";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verify_token = (req: Request, res: Response, next: NextFunction) => {
  const { auth_token } = req.cookies;

  const decoded = jwt.verify(auth_token, process.env.JWT_SECRET_KEY as string);

  if (!decoded) {
    return new API_ERROR("Invalid Token", 401);
  }

  if (typeof decoded !== "object" || !decoded.hasOwnProperty("userId")) {
    throw new API_ERROR("Invalid Token", 401);
  }

  req.userId = (decoded as JwtPayload).userId;

  next();
};
