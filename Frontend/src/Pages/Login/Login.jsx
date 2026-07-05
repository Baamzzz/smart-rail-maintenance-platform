import "./Login.css";
import { apiRequest } from "../../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrainFront,
  User,
  Lock,
  Eye,
  ShieldCheck,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
  
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", data.user.email);
      localStorage.setItem("role", data.user.role);
      navigate("/dashboard");
  
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <section className="login-left">
        <div className="login-brand">
          <TrainFront size={72} />
          <h1>Maintenance AR Software</h1>
          <p>Secure access for railway engineers and control room operators.</p>
        </div>

        <div className="login-features">
          <div>
            <ShieldCheck size={22} />
            <span>Role based access control</span>
          </div>
          <div>
            <Lock size={22} />
            <span>Encrypted maintenance data</span>
          </div>
          <div>
            <TrainFront size={22} />
            <span>AR railway fault reporting</span>
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">
              <TrainFront size={42} />
            </div>

            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <label>Username</label>
            <div className="login-input">
              <User size={20} />
              <input
                type="text"
                placeholder="admin or engineer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <label>Password</label>
            <div className="login-input">
              <Lock size={20} />
              <input
                type="password"
                placeholder="same as username"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Eye size={20} />
            </div>

            <label>2-Step Verification</label>
            <div className="login-input">
              <ShieldCheck size={20} />
              <input
                type="text"
                placeholder="Optional"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              className="login-button"
              type="button"
              onClick={handleLogin}
            >
              Sign In
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="login-help">
            <HelpCircle size={20} />
            <div>
              <p>Having problems signing in?</p>
              <button type="button" className="login-support-link" onClick={() => alert("Support request noted. In the full system this would open the support desk.")}>Contact 24/7 Support</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}