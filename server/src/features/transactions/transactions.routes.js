import express from "express";

import {
  createTransaction,
  listTransactions,
  removeTransaction,
} from "./transactions.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createTransaction).get(listTransactions);
router.delete("/:id", removeTransaction);

export default router;
