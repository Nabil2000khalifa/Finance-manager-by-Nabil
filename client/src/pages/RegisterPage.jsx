import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../features/auth/components/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");

    try {
      await register(values);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthForm mode="register" onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
    </div>
  );
};

export default RegisterPage;
