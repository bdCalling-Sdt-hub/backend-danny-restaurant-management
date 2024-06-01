import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { branchRoutes } from "../modules/branch/branch.route";
import { notificationRoutes } from "../modules/notification/notificaiton.route";
import { otpRoutes } from "../modules/otp/otp.routes";
import { tableRoutes } from "../modules/table/table.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/branch",
    route: branchRoutes,
  },
  {
    path: "/tables",
    route: tableRoutes,
  },
  {
    path: "/notifications",
    route: notificationRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
