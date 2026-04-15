import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist or may have moved.</p>
        <div className="button-row">
          <Link to="/dashboard" className="primary-button">
            Back to dashboard
          </Link>
          <Link to="/login" className="secondary-button">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
