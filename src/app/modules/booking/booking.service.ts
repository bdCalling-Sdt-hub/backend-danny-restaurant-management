import httpStatus from "http-status";
import moment from "moment";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Branch } from "../branch/branch.model";
import { notificationServices } from "../notification/notificaiton.service";
import { Table } from "../table/table.model";
import { BookingsearchableFields } from "./booking.constant";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { bookingUtils } from "./booking.utils";

const insertBookingIntoDB = async (payload: TBooking) => {
  // Cache frequently accessed data
  const branchCache = new Map();
  // Find branch and check if it exists
  let findBranch: any = branchCache.get(payload.branch);
  if (!findBranch) {
    findBranch = await Branch.findById(payload.branch);
    if (!findBranch) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Branch information not found! Please try again"
      );
    }
    branchCache.set(payload.branch, findBranch);
  }

  // Convert date and check if branch is closed on that day
  const date = moment(payload.date, "YYYY-MM-DD");
  const day = date.format("dddd").toLowerCase();
  if (findBranch.daysOfWeek === day) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, `Branch is closed on ${day}`);
  }

  // Check if booking time is within branch hours
  const isWithinBranchHours = bookingUtils.isTimeWithinRange(
    payload.arrivalTime,
    findBranch[day].openTime,
    findBranch[day].closeTime
  );
  if (!isWithinBranchHours) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Booking time conflicts with branch operating hours. Please choose a different time slot."
    );
  }

  // Calculate expire hours
  const expireHours = bookingUtils.calculateExpires(
    payload?.arrivalTime,
    findBranch?.endTimeLimit
  );

  // Check available tables and total bookings concurrently
  const [findTables, totalBookings] = await Promise.all([
    Table.findOne({ branch: payload.branch, seats: payload.seats }),
    Booking.countDocuments({
      branch: payload.branch,
      date: payload.date,
      status: "onGoing",
      arrivalTime: { $lt: expireHours },
      expiryTime: { $gt: payload?.arrivalTime },
    }),
  ]);

  if (!findTables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No tables found for this number of seats"
    );
  }

  if (totalBookings >= findTables?.total) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "No tables available for this time slot. Please try again later or choose a different time."
    );
  }

  // Prepare data for booking
  const data = {
    ...payload,
    expiryTime: expireHours,
    bookingId: bookingUtils.generateBookingID(),
    table: findTables?._id,
  };

  // Create booking and insert notification concurrently
  const result = await Booking.create(data);

  // Insert notification
  await notificationServices.insertNotificationIntoDb({
    message: `${payload?.name} booked a table`,
    refference: result?._id,
  });

  return result;
};

// getallBooking

const findAllBooking = async (query: Record<string, any>, userId: string) => {
  const bookingModel = new QueryBuilder(Booking.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await bookingModel.modelQuery;
  const meta = await bookingModel.countTotal();

  return {
    data,
    meta,
  };
};

const getSingleBooking = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

const updateBooking = async (id: string, payload: Partial<TBooking>) => {
  const result = await Booking.findByIdAndUpdate(id, payload);
  return result;
};

// all branches booking

const allBranchesBooking = async (filters: Record<string, any>) => {
  const { searchTerm, ...filtersData } = filters;
  const pipeline = [];
  // Search term filtering
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: BookingsearchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      },
    });
  }

  // Combine branch and other filters
  const matchCondition: any = {};
  if (filtersData?.arrivalTime || filtersData?.expiryTime) {
    matchCondition.arrivalTime = { $lte: filtersData.expiryTime };
    matchCondition.expiryTime = { $gte: filtersData.arrivalTime };
  }

  if (filtersData.branch) {
    matchCondition.branch = new mongoose.Types.ObjectId(filtersData.branch);
  }
  // Merge matchCondition with filtersData
  const mergedFilters: any = { ...filtersData, ...matchCondition };
  if (Object.keys(mergedFilters).length > 0) {
    pipeline.push({
      $match: mergedFilters,
    });
  }
  // Lookup branches and tables
  pipeline.push(
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1 } }],
        as: "branch",
      },
    },
    {
      $lookup: {
        from: "tables",
        localField: "table",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              table1Capacity: 1,
              table2Capacity: 1,
              table3Capacity: 1,
            },
          },
        ],
        as: "table",
      },
    },
    {
      $project: {
        status: 1,
        name: 1,
        email: 1,
        branch: { $arrayElemAt: ["$branch.name", 0] },
        seats: 1,
        date: 1,
        time: "$arrivalTime",
        bookingId: 1,
        table1Capacity: { $arrayElemAt: ["$table.table1Capacity", 0] },
        table2Capacity: { $arrayElemAt: ["$table.table2Capacity", 0] },
        table3Capacity: { $arrayElemAt: ["$table.table3Capacity", 0] },
      },
    }
  );

  const result = await Booking.aggregate(pipeline);
  return result;
};

const deleteBooking = async (id: string) => {
  const result = await Booking.findByIdAndDelete(id);
  return result;
};

const closeBooking = async () => {
  const result = await Booking.updateMany({
    date: { $lt: moment().format("YYYY-MM-DD") },
    $set: {
      status: "closed",
    },
  });
  return result;
};

export const bookingServices = {
  insertBookingIntoDB,
  findAllBooking,
  getSingleBooking,
  updateBooking,
  allBranchesBooking,
  deleteBooking,
  closeBooking,
};
