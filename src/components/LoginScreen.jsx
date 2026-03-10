import { useState } from "react";

export default function LoginScreen({ onLogin }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onLogin(token.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Food Diary</h1>
      <div className="card">
        <h2>Login</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-light)", marginBottom: 12 }}>
          Enter your GitHub fine-grained PAT with Contents read/write access to the food-diary repo.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="github_pat_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
            />
          </div>
          {error && <div className="status error mb-8">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Checking..." : "Connect"}
          </button>
        </form>
      </div>
    </div>
  );
}
