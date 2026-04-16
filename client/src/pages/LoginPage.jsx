import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../features/auth/components/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");

    try {
      await login(values);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthForm mode="login" onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
    </div>
  );
};

export default LoginPage;
