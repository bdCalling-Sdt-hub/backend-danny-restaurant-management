interface TBooking {
  name: string;
  email: string;
  number?: string;
  branch?: string;
  date: string;
  arrivalTime: string;
  expiryTime: string;
  seats: number;
  bookingId: string;
  isDeleted: boolean;
}
