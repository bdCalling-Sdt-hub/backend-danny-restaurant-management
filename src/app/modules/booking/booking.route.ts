import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { bookingControllers } from "./booking.controller";

const router = Router();
router.post("/", bookingControllers.insertBookingIntoDB);
router.get(
  "/all",
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
  bookingControllers.findAllReservationBybranch
);
router.get(
  "/",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  bookingControllers.getAllBooking
);
router.get("/:id", bookingControllers.getSingleBooking);
router.patch(
  "/:id",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  bookingControllers.updateBooking
);
router.delete(
  "/:id",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  bookingControllers.deleteBooking
);

export const bookingRoutes = router;
