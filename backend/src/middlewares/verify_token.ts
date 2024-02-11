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

  try {
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET_KEY as string);

    if (!decoded) {
      console.log("burda patlıyo");
      throw new API_ERROR("Invalid Token", 401);
    }

    if (typeof decoded !== "object" || !decoded.hasOwnProperty("userId")) {
      console.log("burda patlıyo 2 ");
      throw new API_ERROR("Invalid Token", 401);
    }

    req.userId = (decoded as JwtPayload).userId;

    next();
  } catch (e) {
    res.clearCookie("auth_token");
    throw new API_ERROR("Invalid Token", 401);
    
  }
};
