import { useState, useRef, useEffect } from "react";
import { login, register } from "../api";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
    document.body.classList.add("has-login");
    return () => document.body.classList.remove("has-login");
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3 || username.length > 30) {
      errors.username = "Username must be 3-30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = "Username can only contain letters, digits, and underscore";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (isRegister) {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      let ok;
      if (isRegister) {
        ok = await register(username.trim(), password);
      } else {
        ok = await login(username.trim(), password);
      }
      setSubmitting(false);

      if (ok) {
        onLogin();
      } else if (!isRegister) {
        setError("Invalid username or password");
      }
    } catch (err) {
      setSubmitting(false);
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else {
        setError(err.message);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setFieldErrors({});
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="login-page-bg">
      <div className="login-card">
        <h1 className="login-brand">SnapSeed</h1>
        <p className="login-subtitle">
          {isRegister ? "Create your account to get started" : "Sign in to continue to your budget"}
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <form className="login-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              autoComplete={isRegister ? "username" : "username"}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: "" }));
              }}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit(e)}
              disabled={submitting}
              className={fieldErrors.username ? "input-error" : ""}
            />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }));
              }}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit(e)}
              disabled={submitting}
              className={fieldErrors.password ? "input-error" : ""}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                }}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit(e)}
                disabled={submitting}
                className={fieldErrors.confirmPassword ? "input-error" : ""}
              />
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
            </div>
          )}

          {!isRegister && (
            <div className="remember-row">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={submitting || !username || !password || (isRegister && !confirmPassword)}
          >
            {submitting ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Create account" : "Sign in")}
          </button>
        </form>

        <p className="login-hint" style={{ marginTop: "20px" }}>
          {isRegister ? (
            <>
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>Sign in</a>
            </>
          ) : (
            <>
              New here? <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>Create an account</a>
            </>
          )}
        </p>

        {!isRegister && (
          <p className="login-hint">
            Demo: <code>demo</code> / <code>demo123</code>
          </p>
        )}
      </div>
    </section>
  );
}

export default Login;