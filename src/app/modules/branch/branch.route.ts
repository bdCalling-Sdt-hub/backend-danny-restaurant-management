import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { branchControllers } from "./branch.controller";
import { branchValidation } from "./branch.validation";
const router = Router();
router.post(
  "/",
  validateRequest(branchValidation.createBranchSchema),
  auth(USER_ROLE.super_admin),
  branchControllers.insertBranchIntoDb
);
router.get("/", auth(USER_ROLE.super_admin), branchControllers.getAllBranch);
router.get("/:id", branchControllers.getSingleBranch);
router.get("/openTime-closeTime/:id", branchControllers.getOpenAndCloseTime);

router.patch(
  "/:id",
  validateRequest(branchValidation.updateBranchSchema),
  auth(USER_ROLE.super_admin),
  branchControllers.updateBranch
);

export const branchRoutes = router;
