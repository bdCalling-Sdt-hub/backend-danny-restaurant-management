import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { notificationServices } from "./notificaiton.service";
const insertNotificatonIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationServices.insertNotificationIntoDb(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification added  successfully",
      data: result,
    });
  }
);
const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.getAllNotifications(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getAllNotificationFromDb = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.query, "cc");
    const result = await notificationServices.getAllNotficationsFromDb(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notifications retrived successfully",
      data: result?.data,
      meta: result?.meta,
    });
  }
);
const markAsDone = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.markAsDone(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification mark as read successfully",
    data: result,
  });
});

export const notificationControllers = {
  insertNotificatonIntoDb,
  getAllNotificationFromDb,
  getAllNotification,
  markAsDone,
};
