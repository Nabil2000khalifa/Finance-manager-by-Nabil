import cors from "cors";
import express from "express";
import morgan from "morgan";

import accountsRoutes from "../features/accounts/accounts.routes.js";
import authRoutes from "../features/auth/auth.routes.js";
import billsRoutes from "../features/bills/bills.routes.js";
import budgetsRoutes from "../features/budgets/budgets.routes.js";
import dashboardRoutes from "../features/dashboard/dashboard.routes.js";
import notificationsRoutes from "../features/notifications/notifications.routes.js";
import settingsRoutes from "../features/settings/settings.routes.js";
import transactionsRoutes from "../features/transactions/transactions.routes.js";
import { errorHandler, notFound } from "../middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Finance Manager API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
