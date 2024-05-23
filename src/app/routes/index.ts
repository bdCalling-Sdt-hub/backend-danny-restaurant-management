import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { branchRoutes } from "../modules/branch/branch.route";
import { otpRoutes } from "../modules/otp/otp.routes";
import { tableRoutes } from "../modules/table/table.route";
import { notificationRoutes } from "../modules/notification/notificaiton.route";

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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
