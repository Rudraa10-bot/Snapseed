import { useState, useRef, useEffect } from "react";
import { login } from "../api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const ok = await login(username, password);
    setSubmitting(false);

    if (ok) {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <section className="section" style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container" style={{ maxWidth: "400px" }}>
        <div className="login-card">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "4px" }}>Sign in to SnapSeed</h2>
          <p className="section-desc" style={{ textAlign: "center", marginBottom: "24px" }}>Enter your credentials to continue</p>

          {error && (
            <div className="error-banner" style={{ marginBottom: "16px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <form className="expense-form" onSubmit={handleSubmit} ref={formRef}>
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label htmlFor="username" style={{ display: "block", marginBottom: "6px" }}>Username</label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit(e)}
                disabled={submitting}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--grey-border)", borderRadius: "6px", fontSize: "15px" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit(e)}
                disabled={submitting}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--grey-border)", borderRadius: "6px", fontSize: "15px" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <label htmlFor="remember" style={{ margin: 0, fontSize: "14px", color: "var(--grey-text)" }}>Remember me</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !username || !password}
              style={{ width: "100%", padding: "12px" }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-hint" style={{ marginTop: "16px", textAlign: "center", fontSize: "13px", color: "var(--grey-text)" }}>
            Demo: <code>demo</code> / <code>demo123</code>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;