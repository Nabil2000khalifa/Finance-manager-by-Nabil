import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/budgets", label: "Budgets" },
  { to: "/bills", label: "Bills" },
  { to: "/accounts", label: "Accounts" },
  { to: "/notifications", label: "Notifications" },
  { to: "/settings", label: "Settings" },
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Finance Manager</p>
          <h1>Keep your money in view.</h1>
          <span className="brand-chip">{user?.currency || "USD"} mode</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user?.name || "User"}</h2>
          </div>

          <button type="button" className="secondary-button" onClick={logout}>
            Log out
          </button>
        </header>

        <main className="content-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
