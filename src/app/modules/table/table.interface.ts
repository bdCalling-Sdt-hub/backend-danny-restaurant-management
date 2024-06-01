import { ObjectId } from "mongoose";

export interface Ttable {
  branch: ObjectId;
  seats: number;
  isDeleted: boolean;
  total: number;
  table1Capacity: number;
  table2Capacity: number;
  table3Capacity: number;
}
