import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { User, Clock, ShieldCheck, LogOut, Network } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user, logout } = useAuth();
    const [joinedAt, setJoinedAt] = useState(null);

    useEffect(() => {
        if (user?._id) {
            const m = new Date().toLocaleString();
            setJoinedAt(m);
        }
    }, [user]);

    if (!user) return null;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .profile-page {
          min-height: 100vh;
          background: #080808;
          color: #fafafa;
          padding: 6rem 1rem 4rem;
          font-family: 'Inter', sans-serif;
        }
        .profile-container {
          max-width: 880px;
          margin: 0 auto;
        }
        .profile-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.7rem;
          margin-bottom: 1.75rem;
        }
        .profile-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(1.5rem, 4vw, 2rem);
          margin-bottom: 0.5rem;
        }
        .profile-sub {
          color: #8f8f9a;
          margin-bottom: 1.2rem;
          line-height: 1.65;
          max-width: 700px;
        }
        .profile-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }
        .metric-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 1rem;
        }
        .metric-label {
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.63rem;
          margin-bottom: 0.25rem;
        }
        .metric-value {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: #fafafa;
          font-size: 1.25rem;
        }
        .profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-top: 1.5rem;
        }
        .btn-logout, .btn-go-app {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.7rem 1.1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-go-app {
          color: #0a0a0a;
          background: #eab308;
          border-color: #eab308;
        }
        .btn-go-app:hover { background: #ca8a04; }
        .btn-logout {
          color: #ef4444;
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.3);
        }
        .btn-logout:hover { filter: brightness(0.95); }
        @media (max-width: 640px) {
          .profile-metrics { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="profile-page">
                <div className="profile-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="profile-title">Welcome, {user.name || "User"} 🔒</h1>
                        <p className="profile-sub">
                            This is your profile center. From here, you can manage your authentication state,
                            view your account analytics, and quickly jump back to the distributed analyzer.
                        </p>

                        <div className="profile-card">
                            <div className="profile-metrics">
                                <div className="metric-item">
                                    <div className="metric-label"><User size={14} /> Account ID</div>
                                    <div className="metric-value">{user._id}</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-label"><Clock size={14} /> Last Login</div>
                                    <div className="metric-value">{joinedAt || "Just now"}</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-label"><ShieldCheck size={14} /> Email</div>
                                    <div className="metric-value">{user.email}</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-label">AI Nodes Enabled</div>
                                    <div className="metric-value">4 / 4</div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <Link to="/app" className="btn-go-app"><Network size={14} /> Go to Detector</Link>
                                <button onClick={() => logout()} className="btn-logout"><LogOut size={14} /> Logout</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
