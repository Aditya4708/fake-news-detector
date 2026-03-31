import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/app");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .auth-page {
          min-height: 100vh;
          background: #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(234,179,8,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .auth-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          position: relative; z-index: 2;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%; max-width: 420px;
        }
        .auth-logo {
          display: flex; align-items: center; gap: 0.5rem;
          text-decoration: none; margin-bottom: 2rem;
        }
        .auth-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #eab308, #ca8a04);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 13px; color: #0a0a0a;
        }
        .auth-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 1.1rem; color: #fafafa;
        }
        .auth-logo-text span { color: #eab308; }
        .auth-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 1.6rem;
          color: #fafafa; letter-spacing: -0.5px; margin-bottom: 0.4rem;
        }
        .auth-subtitle {
          color: #52525b; font-size: 0.78rem;
          margin-bottom: 2rem; line-height: 1.6;
        }
        .auth-subtitle a { color: #eab308; text-decoration: none; }
        .auth-subtitle a:hover { text-decoration: underline; }
        .form-group { margin-bottom: 1.25rem; }
        .form-label {
          display: block; font-size: 0.68rem; color: #71717a;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.5rem;
        }
        .form-input-wrap { position: relative; }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 0.75rem 1rem;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem; outline: none; transition: all 0.2s;
        }
        .form-input:focus {
          border-color: rgba(234,179,8,0.4);
          background: rgba(234,179,8,0.03);
          box-shadow: 0 0 0 3px rgba(234,179,8,0.08);
        }
        .form-input::placeholder { color: #3f3f46; }
        .form-input.has-icon { padding-right: 2.75rem; }
        .input-icon-btn {
          position: absolute; right: 0.75rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: #52525b; cursor: pointer; padding: 0.25rem;
          transition: color 0.2s;
        }
        .input-icon-btn:hover { color: #a1a1aa; }
        .form-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px; padding: 0.75rem 1rem;
          color: #ef4444; font-size: 0.75rem;
          margin-bottom: 1.25rem; letter-spacing: 0.3px;
        }
        .submit-btn {
          width: 100%; background: #eab308; color: #0a0a0a;
          border: none; border-radius: 8px; padding: 0.85rem;
          font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; letter-spacing: 0.3px; margin-top: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ca8a04; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(234,179,8,0.25);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-divider {
          display: flex; align-items: center; gap: 1rem;
          margin: 1.5rem 0; color: #3f3f46;
          font-size: 0.7rem; letter-spacing: 1px;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .trust-row {
          display: flex; align-items: center;
          justify-content: center; gap: 0.4rem;
          margin-top: 1.5rem; color: #3f3f46;
          font-size: 0.68rem; letter-spacing: 0.5px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(10,10,10,0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

            <div className="auth-page">
                <div className="auth-bg-grid" />
                <div className="auth-glow" />

                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo-icon">TN</div>
                        <span className="auth-logo-text">Truth<span>Net</span></span>
                    </Link>

                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">
                        Don't have an account?{" "}
                        <Link to="/signup">Sign up free</Link>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="form-input-wrap">
                                <input
                                    className="form-input has-icon"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="input-icon-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="form-error">⚠ {error}</div>}

                        <button className="submit-btn" type="submit" disabled={loading}>
                            {loading ? (
                                <><span className="btn-spinner" /> Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">secure & encrypted</div>

                    <div className="trust-row">
                        <ShieldCheck size={12} />
                        Your data is encrypted and never sold
                    </div>
                </motion.div>
            </div>
        </>
    );
}