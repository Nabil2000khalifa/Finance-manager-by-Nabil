import express from "express";

import { createBill, listBills } from "./bills.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(createBill).get(listBills);

export default router;
