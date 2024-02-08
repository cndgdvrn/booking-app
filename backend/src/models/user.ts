import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/types";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password
        delete ret.createdAt
        delete ret.updatedAt
      },
    },
    collection: "Users",
    timestamps: true,
    versionKey: false,
  }
);



userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
