import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/AppLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AccountsPage from "../pages/AccountsPage.jsx";
import BillsPage from "../pages/BillsPage.jsx";
import BudgetsPage from "../pages/BudgetsPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import TransactionsPage from "../pages/TransactionsPage.jsx";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
