import express from "express";

import { addAccount, listAccounts, transferFunds } from "./accounts.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", listAccounts);
router.post("/", addAccount);
router.post("/transfer", transferFunds);

export default router;
