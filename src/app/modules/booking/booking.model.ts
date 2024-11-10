import mongoose, { Schema, model } from "mongoose";
import { BStatus } from "./booking.constant";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    number: {
      type: Number,
    },
    table: {
      type: mongoose.Types.ObjectId,
      ref: "Table",
    },

    branch: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      index: true,
    },
    expiryTime: {
      type: String,
      required: true,
      index: true,
    },
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BStatus),
      default: "onGoing",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// filter out deleted documents
bookingSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

bookingSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

bookingSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Booking = model<TBooking>("Booking", bookingSchema);
