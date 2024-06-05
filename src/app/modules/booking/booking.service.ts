import httpStatus from "http-status";
import moment from "moment";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Branch } from "../branch/branch.model";
import { Table } from "../table/table.model";
import { BookingsearchableFields } from "./booking.constant";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { bookingUtils } from "./booking.utils";

const insertBookingIntoDB = async (payload: TBooking) => {
  // find branch
  const findBranch: any = await Branch.findById(payload.branch);
  if (!findBranch) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Branch information not found! Please try again"
    );
  }
  //   date convert
  const date = moment(payload.date, "YYYY-MM-DD");
  const day = date.format("dddd").toLowerCase();
  if (findBranch.daysOfWeek === day) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, `Branch is closed on ${day}`);
  }
  //   check is close and opentime conflict
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
  //
  //   set expires hours
  const expireHours = bookingUtils.calculateExpires(
    payload?.arrivalTime,
    findBranch?.endTimeLimit
  );
  //   check avaiable tables
  const findTables = await Table.findOne({
    branch: payload.branch,
    seats: payload.seats,
  });

  if (!findTables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No tables found for this number of seats"
    );
  }

  //   check total booking during this date and time
  const totalBookings = await Booking.countDocuments({
    branch: payload.branch,
    date: payload.date,
    arrivalTime: { $lt: expireHours },
    expiryTime: { $gt: payload?.arrivalTime },
  });

  //   check is any tables availble for this momemt
  if (totalBookings >= findTables?.total) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "No tables available for this time slot. Please try again later or choose a different time."
    );
  }
  const data = {
    ...payload,
    expiryTime: expireHours,
    bookingId: bookingUtils.generateBookingID(),
    table: findTables?._id,
  };
  const result = await Booking.create(data);
  return result;
};

// getallBooking

const findAllBooking = async (query: Record<string, any>) => {
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

export const bookingServices = {
  insertBookingIntoDB,
  findAllBooking,
  getSingleBooking,
  updateBooking,
  allBranchesBooking,
};
