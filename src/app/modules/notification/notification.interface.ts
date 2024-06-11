import { ObjectId } from "mongodb";

export interface TNotification {
  receiver: ObjectId;
  message: string;
  branch: string;
  date?: string;
  time?: string;
  seats?: number;
  refference: ObjectId;
  read: boolean;
  isDeleted: boolean;
}
