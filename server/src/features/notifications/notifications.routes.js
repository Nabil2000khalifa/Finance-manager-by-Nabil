import express from "express";

import {
  createUserNotification,
  listNotifications,
  updateNotification,
} from "./notifications.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createUserNotification).get(listNotifications);
router.patch("/:id/read", updateNotification);

export default router;
