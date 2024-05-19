import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateOtp } from "../../utils/otpGenerator";
import moment from "moment";
import { deleteFile } from "../../utils/fileHelper";
import config from "../../config";
import jwt, { Secret } from "jsonwebtoken";
import { sendEmail } from "../../utils/mailSender";
import QueryBuilder from "../../builder/QueryBuilder";
import bcrypt from "bcrypt";
const insertSubAdminIntoDb = async (
  payload: Partial<TUser>
): Promise<TUser> => {
  const user = await User.isUserExist(payload.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "user already exist with this email"
    );
  }

  const result = await User.create(payload);

  return result;
};

const getme = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateProfile = async (
  id: string,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const user = await User.findById(id);
  //  email update lagbe na
  if (payload?.email) {
    throw new AppError(httpStatus?.BAD_REQUEST, "email is not for update");
  }
  if (payload?.role) {
    throw new AppError(httpStatus?.BAD_REQUEST, "role is not for update");
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (result && payload?.image) {
    await deleteFile(user?.image!);
  }
  return result;
};

const getAllusers = async (query: Record<string, any>) => {
  const result = await User.find(query);

  return result;
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};
const updateUser = async (
  id: string,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const user = await User.findById(id);
  //  email update lagbe na
  if (payload?.email) {
    throw new AppError(httpStatus?.BAD_REQUEST, "email is not for update");
  }
  if (payload?.role) {
    throw new AppError(httpStatus?.BAD_REQUEST, "role is not for update");
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (result && payload?.image) {
    await deleteFile(user?.image!);
  }
  return result;
};

const deleteAccount = async (id: string, password: string) => {
  const user = await User.IsUserExistbyId(id);
  const isPasswordMatched = await bcrypt.compare(password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Password does not match!");
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );
  return result;
};

export const userServices = {
  insertSubAdminIntoDb,
  getme,
  updateProfile,
  getAllusers,
  updateUser,
  getSingleUser,
  deleteAccount,
};
