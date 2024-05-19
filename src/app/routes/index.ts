import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { branchRoutes } from "../modules/branch/branch.route";
import { otpRoutes } from "../modules/otp/otp.routes";

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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
