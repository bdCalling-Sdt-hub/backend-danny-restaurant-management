import { Router } from "express";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", bookingControllers.insertBookingIntoDB);

export const bookingRoutes = router;
