import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import API_ERROR from "../utils/api_error";
import { registerSchema } from "../validations/validationSchemas";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {value,error} = registerSchema.validate(req.body);

    if(error){
        return res.json({
            err:error
        })
    }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new API_ERROR("User already exists", 400);
  }
};
