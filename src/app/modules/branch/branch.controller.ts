import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { branchservices } from "./branch.service";
const insertBranchIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await branchservices.insertBranchIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch created successfully.",
    data: result,
  });
});
const getAllBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await branchservices.getAllBranch();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branches retrived successfully.",
    data: result,
  });
});

const getOpenAndCloseTime = catchAsync(async (req: Request, res: Response) => {
  const result = await branchservices.getOpenandCloseTime(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch retrived successfully.",
    data: result,
  });
});
const updateBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await branchservices.updateBranch(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch updated successfully.",
    data: result,
  });
});

export const branchControllers = {
  insertBranchIntoDb,
  getAllBranch,
  getOpenAndCloseTime,
  updateBranch,
};
