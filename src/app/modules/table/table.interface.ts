import { Model, ObjectId } from "mongoose";

export interface Ttable {
  branch: ObjectId;
  seats: number;
  isDeleted:boolean
  table1Capacity: number;
  table2Capacity: number;
  table3Capacity: number;
}
