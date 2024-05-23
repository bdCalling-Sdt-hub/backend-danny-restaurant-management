import { Schema, model } from "mongoose";
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
    tables: {
      type: Number,
      required: true,
      default: 0,
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
