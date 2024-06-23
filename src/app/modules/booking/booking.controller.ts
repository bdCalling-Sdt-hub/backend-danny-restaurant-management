import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";

const insertBookingIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.insertBookingIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation inserted successfully.",
    data: result,
  });
});
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.findAllBooking(
    req.query,
    req?.user?.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservations retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  console.log(req.params.id);
  const result = await bookingServices.getSingleBooking(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation retrived successfully",
    data: result,
  });
});
const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.updateBooking(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation updated successfully",
    data: result,
  });
});
const findAllReservationBybranch = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingServices.allBranchesBooking(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reservations retrived successfully",
      data: result,
    });
  }
);
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.deleteBooking(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation deleted successfully",
    data: result,
  });
});
const canCelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.cancelBooking(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation cancelled successfully",
    data: result,
  });
});

export const bookingControllers = {
  insertBookingIntoDB,
  getSingleBooking,
  getAllBooking,
  updateBooking,
  findAllReservationBybranch,
  deleteBooking,
  canCelBooking,
};
