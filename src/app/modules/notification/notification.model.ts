import { model, Schema } from "mongoose";
import { TNotification } from "./notification.interface";

const NotificationSchema = new Schema<TNotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "Receiver id is required"],
    },
    refference: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: [true, "Booking id is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// filter out deleted documents
NotificationSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NotificationSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NotificationSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Notification = model<TNotification>(
  "Notification",
  NotificationSchema
);
