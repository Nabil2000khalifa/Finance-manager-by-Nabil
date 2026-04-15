import express from "express";

import { getSummary } from "./dashboard.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);

export default router;
