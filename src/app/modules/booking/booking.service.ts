import httpStatus from "http-status";
import moment from "moment";
import AppError from "../../error/AppError";
import { Branch } from "../branch/branch.model";
import { Table } from "../table/table.model";
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
  const totalTables = await Table.findOne({
    branch: payload.branch,
    seats: payload.seats,
  });

  if (!totalTables) {
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
  if (totalBookings >= totalTables?.total) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "No tables available for this time slot. Please try again later or choose a different time."
    );
  }
  const data = {
    ...payload,
    expiryTime: expireHours,
    bookingId: bookingUtils.generateBookingID(),
  };
  const result = await Booking.create(data);
  return result;
};

export const bookingServices = {
  insertBookingIntoDB,
};
