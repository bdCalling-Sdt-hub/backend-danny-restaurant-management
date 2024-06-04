import { ObjectId } from "mongoose";

export interface TBooking {
  name: string;
  email: string;
  number?: string;
  branch?: ObjectId;
  date: string;
  arrivalTime: string;
  expiryTime: string;
  seats: number;
  bookingId: string;
  isDeleted: boolean;
  table: ObjectId;
  status: "onGoing" | "rejected" | "closed" | "canCelled";
}
