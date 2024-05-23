import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { tableControllers } from "./table.controller";
const router = Router();
router.post(
  "/",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  tableControllers.insertTableIntoDb
);
router.get("/", tableControllers.getAllTables);
router.get("/:id", tableControllers.getSingleTable);
router.patch(
  "/:id",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  tableControllers.updateTable
);
router.delete(
  "/:id",
  auth(USER_ROLE.sub_admin, USER_ROLE.super_admin),
  tableControllers.deleteTable
);

export const tableRoutes = router;
