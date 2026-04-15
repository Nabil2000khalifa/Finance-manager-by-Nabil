import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getInitialValues = (mode) =>
  mode === "register"
    ? { name: "", email: "", password: "" }
    : { email: "", password: "" };

const AuthForm = ({ mode, onSubmit, isSubmitting, error }) => {
  const [formData, setFormData] = useState(getInitialValues(mode));
  const isRegister = mode === "register";

  useEffect(() => {
    setFormData(getInitialValues(mode));
  }, [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="auth-card">
      <p className="eyebrow">Finance Manager</p>
      <h1>{isRegister ? "Create your account" : "Sign in to continue"}</h1>
      <p>
        {isRegister
          ? "Start tracking accounts, transactions, bills, and budgets from one place."
          : "Pick up where you left off and keep your money flow easy to understand."}
      </p>

      {error ? <div className="message-banner error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {isRegister ? (
            <div className="field full-width">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                placeholder="Nabil Ahmed"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          ) : null}

          <div className="field full-width">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field full-width">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
          </button>
        </div>
      </form>

      <p className="form-footer muted-text">
        {isRegister ? "Already have an account?" : "Need a new account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"} className="ghost-button">
          {isRegister ? "Sign in here" : "Register here"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
