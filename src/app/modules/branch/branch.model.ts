import mongoose, { Schema, model } from "mongoose";
import { daysOfWeek } from "./branch.constant";
import { TBranch } from "./branch.interface";
const branchSchema = new Schema<TBranch>(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    timeBlocks: [
      {
        date: String,
        startTime: String,
        endTime: String,
      },
    ],
    daysOfWeek: {
      type: String,
      enum: Object.values(daysOfWeek),
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tables: {
      type: Number,
      required: true,
      default: 0,
    },
    sunday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    monday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    tuesday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    wednesday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    thursday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    friday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    saturday: {
      openTime: {
        type: String,
        default: "09:00",
      },
      closeTime: {
        type: String,
        default: "20:00",
      },
      isClosed: Boolean,
    },
    endTimeLimit: {
      type: Number,
      default: 120,
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

branchSchema.pre("save", function (next) {
  const branch = this;
  Object.values(daysOfWeek).forEach((day) => {
    if (branch.daysOfWeek.includes(day)) {
      branch[day].isClosed = true;
      branch[day].openTime = "00:00";
      branch[day].closeTime = "00:00";
    }
  });
  next();
});
// filter out deleted documents
branchSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

branchSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

branchSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Branch = model<TBranch>("Branch", branchSchema);
