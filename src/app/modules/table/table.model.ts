import mongoose, { Schema, model } from "mongoose";
import { Ttable } from "./table.interface";
const tableSchema = new Schema<Ttable>(
  {
    branch: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    table1Capacity: {
      type: Number,
      default: 0,
    },
    table2Capacity: {
      type: Number,
      default: 0,
    },
    table3Capacity: {
      type: Number,
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
tableSchema.statics.isUniqueTable = async function (
  id: string,
  tableNo: string
) {
  return await Table.findOne({ restaurant: id, tableNo: tableNo });
};
// filter out deleted documents
tableSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
tableSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
tableSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Table = model<Ttable>("Table", tableSchema);
