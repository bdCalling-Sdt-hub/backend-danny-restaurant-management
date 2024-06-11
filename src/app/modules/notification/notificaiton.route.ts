import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { notificationControllers } from "./notification.controller";

const router = Router();
// router.post("/",)
router.get(
  "/",
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
  notificationControllers.getAllNotificationFromDb
);
// router.get(
//   "/",
//   auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
//   notificationControllers.getAllNotification
// );
router.patch(
  "/",
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
  notificationControllers.markAsDone
);

export const notificationRoutes = router;
