import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { emitMessage } from "../../utils/socket";
import { Notification } from "./notification.model";

const insertNotificationIntoDb = async (payload: any) => {
  const result = await Notification.create(payload);
  // @ts-ignore
  emitMessage("notification", payload?.message);
  return result;
};

// const getAllNotficationsFromDb = async (query: Record<string, any>) => {
//   const { page = 1, limit = 10 } = query;
//   const skip = (page - 1) * limit;
//   const totalCount = await Notification.countDocuments();
//   const result = await Notification.aggregate([
//     {
//       $lookup: {
//         from: "bookings",
//         let: { bookingId: "$refference" },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ["$_id", "$$bookingId"] },
//             },
//           },
//           {
//             $project: {
//               branch: 1,
//               arrivalTime: 1,
//               name: 1,
//               date: 1,
//               seats: 1,
//               bookingId: 1,
//             },
//           },
//         ],
//         as: "booking",
//       },
//     },
//     { $unwind: "$booking" },
//     {
//       $lookup: {
//         from: "branches",
//         let: { branchId: "$booking.branch" },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ["$_id", "$$branchId"] },
//             },
//           },
//           {
//             $project: {
//               name: 1,
//             },
//           },
//         ],
//         as: "branch",
//       },
//     },
//     { $unwind: "$branch" },
//     {
//       $project: {
//         customer: "$booking.name",
//         seats: "$booking.seats",
//         arrivalDate: "$booking.date",
//         branch: "$branch.name",
//         arrivalTime: "$booking.arrivalTime",
//         isDeleted: 1,
//         read: 1,
//         message: 1,
//       },
//     },
//     { $skip: skip },
//     { $limit: limit },
//   ]);

//   const meta = {
//     total: result?.length,
//     page: page,
//     limit: limit,
//     totalPage: totalCount,
//   };
//   return { data: result, meta };
// };

const getAllNotficationsFromDb = async (query: Record<string, any>) => {
  const { page = 1, limit = 10, branch: branchId } = query;
  console.log(query);
  const skip = (page - 1) * limit;

  // Build the match stage for the specific branch if provided
  const branchMatchStage = branchId
    ? { "booking.branch": new mongoose.Types.ObjectId(branchId.toString()) }
    : {};

  const totalCount = await Notification.countDocuments(branchMatchStage);
  const result = await Notification.aggregate([
    {
      $lookup: {
        from: "bookings",
        let: { bookingId: "$refference" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$bookingId"] },
            },
          },
          {
            $project: {
              branch: 1,
              arrivalTime: 1,
              name: 1,
              date: 1,
              seats: 1,
              bookingId: 1,
            },
          },
        ],
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: branchMatchStage,
    },
    {
      $lookup: {
        from: "branches",
        let: { branchId: "$booking.branch" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$branchId"] },
            },
          },
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $project: {
        customer: "$booking.name",
        seats: "$booking.seats",
        arrivalDate: "$booking.date",
        branch: "$branch.name",
        arrivalTime: "$booking.arrivalTime",
        isDeleted: 1,
        read: 1,
        message: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = {
    total: result?.length,
    page: page,
    limit: limit,
    totalPage: Math.ceil(totalCount / limit),
  };
  return { data: result, meta };
};

const getAllNotifications = async (query: Record<string, any>) => {
  const notificationModel = new QueryBuilder(Notification.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await notificationModel.modelQuery;
  const meta = await notificationModel.countTotal();
  return {
    data,
    meta,
  };
};

const markAsDone = async (id: string) => {
  const result = await Notification.updateMany(
    { receiver: id },
    {
      $set: {
        read: true,
      },
    },
    { new: true }
  );
  return result;
};

export const notificationServices = {
  insertNotificationIntoDb,
  getAllNotifications,
  getAllNotficationsFromDb,
  markAsDone,
};
