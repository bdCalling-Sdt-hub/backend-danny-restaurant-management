import mongoose from "mongoose";
import { TBranch } from "./branch.interface";
import { Branch } from "./branch.model";

const insertBranchIntoDB = async (payload: TBranch) => {
  const result = await Branch.create(payload);
  return result;
};

const getAllBranch = async () => {
  const result = await Branch.find();
  return result;
};

const getOpenandCloseTime = async (id: string) => {
  const result: any = Branch.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id), // Ensure the ID is correctly formatted as an ObjectId
      },
    },
    {
      $project: {
        branch: "$name",
        schedule: {
          $map: {
            input: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            as: "day",
            in: {
              day: "$$day",
              openTime: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$$day", "Sunday"] },
                      then: "$sunday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Monday"] },
                      then: "$monday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Tuesday"] },
                      then: "$tuesday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Wednesday"] },
                      then: "$wednesday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Thursday"] },
                      then: "$thursday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Friday"] },
                      then: "$friday.openTime",
                    },
                    {
                      case: { $eq: ["$$day", "Saturday"] },
                      then: "$saturday.openTime",
                    },
                  ],
                  default: null,
                },
              },
              closeTime: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$$day", "Sunday"] },
                      then: "$sunday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Monday"] },
                      then: "$monday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Tuesday"] },
                      then: "$tuesday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Wednesday"] },
                      then: "$wednesday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Thursday"] },
                      then: "$thursday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Friday"] },
                      then: "$friday.closeTime",
                    },
                    {
                      case: { $eq: ["$$day", "Saturday"] },
                      then: "$saturday.closeTime",
                    },
                  ],
                  default: null,
                },
              },
              isClosed: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$$day", "Sunday"] },
                      then: "$sunday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Monday"] },
                      then: "$monday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Tuesday"] },
                      then: "$tuesday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Wednesday"] },
                      then: "$wednesday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Thursday"] },
                      then: "$thursday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Friday"] },
                      then: "$friday.isClosed",
                    },
                    {
                      case: { $eq: ["$$day", "Saturday"] },
                      then: "$saturday.isClosed",
                    },
                  ],
                  default: null,
                },
              },
            },
          },
        },
      },
    },
  ]);
  return result;
};

const updateBranch = async (id: string, payload: Partial<TBranch>) => {
  const result = await Branch.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const getSingleBranch = async (id: string) => {
  const result = await Branch.findById(id);
  return result;
};
export const branchservices = {
  insertBranchIntoDB,
  getAllBranch,
  getOpenandCloseTime,
  updateBranch,
  getSingleBranch,
};
