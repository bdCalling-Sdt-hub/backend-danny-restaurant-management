import { ObjectId } from "mongodb";
import { Model } from "mongoose";
export interface TUser {
  [x: string]: any;
  id: string;
  email: string;
  branch?: ObjectId;
  designation: string;
  password: string;
  phoneNumber?: string;
  name: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "admin" | "super_admin" | "user" | "sub_admin";
  isDeleted: boolean;
  image?: string;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
}

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  IsUserExistbyId(id: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
