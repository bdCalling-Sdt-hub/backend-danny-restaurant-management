export enum BStatus {
  onGoing = "onGoing",
  closed = "closed",
  canCencelled = "canCencelled",
  rejected = "rejected",
}

export const BookingfilterableFileds = [
  "arrivalTime",
  "expiryTime",
  "date",
  "branch",
];
export const BookingsearchableFields = ["bookingId", "email", "name"];
