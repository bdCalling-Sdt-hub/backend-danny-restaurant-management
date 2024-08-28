import moment from "moment";
import { Booking } from "./booking.model";

const calculateExpires = (arrivalTime: string, limit: number) => {
  return moment(arrivalTime, "HH:mm")
    .add(limit, "minutes") // Change "hours" to "minutes"
    .subtract(1, "minute")
    .format("HH:mm");
};

const isTableAvailable = async (
  arrivalTime: string,
  expiryTime: string,
  date: string,
  branch: string,
  seats: number
) => {
  const booking = await Booking.findOne({
    date,
    seats,
    branch,
    $or: [
      { arrivalTime: { $lt: expiryTime }, expiryTime: { $gt: arrivalTime } },
      { arrivalTime: { $gte: arrivalTime, $lte: expiryTime } },
    ],
  });
  return !booking;
};

const isTimeWithinRange = (
  time: string,
  startTime: string,
  endTime: string
) => {
  const arrivalTime = moment(time, "HH:mm");
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");
  return arrivalTime.isBetween(start, end, null, "[]");
};

const generateBookingID = (): string => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `${randomNumber}${Date.now()}`.slice(0, 8);
};
const addFifteenMinutes = (time: string) => {
  if (!time) {
    throw new Error("Invalid time input");
  }

  // Parse the time and add 15 minutes
  const newTime = moment(time, "HH:mm").add(15, "minutes").format("HH:mm");

  return newTime;
};

export const bookingUtils = {
  calculateExpires,
  isTableAvailable,
  isTimeWithinRange,
  generateBookingID,
  addFifteenMinutes,
};
