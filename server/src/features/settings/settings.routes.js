import express from "express";

import {
  getUserProfile,
  updateUserCurrency,
  updateUserProfile,
} from "./settings.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/currency", updateUserCurrency);

export default router;
