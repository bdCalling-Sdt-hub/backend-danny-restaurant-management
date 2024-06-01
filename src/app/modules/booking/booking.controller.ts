import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";

const insertBookingIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.insertBookingIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking inserted successfully.",
    data: result,
  });
});

export const bookingControllers = {
  insertBookingIntoDB,
};
