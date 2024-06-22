import { Router } from "express";
import { tz } from "moment-timezone";
import cron from "node-cron";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { bookingControllers } from "./booking.controller";
import { bookingServices } from "./booking.service";
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

cron.schedule(
  "0 0 * * *",
  async () => {
    const germanyTime = tz("Europe/Berlin").format("HH:mm");
    if (germanyTime === "00:00") {
      await bookingServices.closeBooking();
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Berlin", // Set the timezone to Germany time
  }
);

export const bookingRoutes = router;
