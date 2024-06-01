import mongoose, { Schema, model } from "mongoose";

const bookingSchema = new Schema<TBooking>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
    },
    branch: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      unique: true,
      required: true,
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
