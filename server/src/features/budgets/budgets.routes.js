import express from "express";

import { createOrUpdateBudget, listBudgets } from "./budgets.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(createOrUpdateBudget).get(listBudgets);

export default router;
