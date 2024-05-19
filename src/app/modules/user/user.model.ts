import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    designation: {
      type: String,
      required: true,
    },
    branch: {
      type: ObjectId,
    },
    passwordChangedAt: {
      type: Date,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "user"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});
// filter out deleted documents
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select("+password");
};
userSchema.statics.IsUserExistbyId = async function (id: string) {
  return await User.findById(id).select("+password");
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
