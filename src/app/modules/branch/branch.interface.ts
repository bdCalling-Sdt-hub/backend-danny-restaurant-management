import { daysOfWeek } from "./branch.constant";

interface OpeningAndClosingTime {
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
}
export interface TBranch {
  name: string;
  location: string;
  isDeleted: boolean;
  tables: number;
  endTimeLimit: number;
  daysOfWeek: daysOfWeek;
  saturday: OpeningAndClosingTime;
  sunday: OpeningAndClosingTime;
  monday: OpeningAndClosingTime;
  tuesday: OpeningAndClosingTime;
  wednesday: OpeningAndClosingTime;
  thursday: OpeningAndClosingTime;
  friday: OpeningAndClosingTime;
}
