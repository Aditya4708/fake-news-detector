import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "How It Works", href: "/#how-it-works" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .nav-root {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .nav-root.scrolled {
          background: rgba(10, 10, 10, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(234, 179, 8, 0.15);
          box-shadow: 0 0 40px rgba(234, 179, 8, 0.05);
        }
        .nav-root.top {
          background: transparent;
          border-bottom: 1px solid transparent;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #eab308, #ca8a04);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #0a0a0a;
          letter-spacing: -1px;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          color: #fafafa;
          letter-spacing: -0.5px;
        }
        .nav-logo-text span {
          color: #eab308;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .nav-links a:hover, .nav-links a.active {
          color: #fafafa;
          background: rgba(255,255,255,0.06);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-login {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .btn-login:hover {
          color: #fafafa;
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.05);
        }
        .btn-signup {
          background: #eab308;
          color: #0a0a0a;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.45rem 1.1rem;
          border-radius: 6px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .btn-signup:hover {
          background: #ca8a04;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(234,179,8,0.3);
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 6px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
        }
        .hamburger span {
          width: 20px;
          height: 2px;
          background: #fafafa;
          border-radius: 2px;
          transition: all 0.3s ease;
          display: block;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .mobile-menu {
          position: fixed;
          top: 64px;
          left: 0; right: 0; bottom: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          z-index: 99;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-top: 1px solid rgba(234,179,8,0.15);
          transform: translateY(-10px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s ease;
        }
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .mobile-links a {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: block;
          border: 1px solid transparent;
        }
        .mobile-links a:hover {
          color: #fafafa;
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mobile-actions .btn-login,
        .mobile-actions .btn-signup {
          width: 100%;
          text-align: center;
          padding: 0.75rem;
          font-size: 0.82rem;
          display: block;
        }
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

            <nav className={`nav-root ${scrolled ? "scrolled" : "top"}`}>
                <div className="nav-inner">

                    <Link to="/" className="nav-logo">
                        <div className="nav-logo-icon">TN</div>
                        <span className="nav-logo-text">Truth<span>Net</span></span>
                    </Link>


                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className={location.pathname === link.href ? "active" : ""}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                <div className="nav-actions">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/signup" className="btn-signup">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/app" className="btn-login">Detector</Link>
                            <Link to="/history" className="btn-login">History</Link>
                            <Link to="/profile" className="btn-signup">Profile</Link>
                            <button
                                className="btn-login"
                                style={{ border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                                onClick={() => { logout(); navigate("/"); }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                <button
                    className={`hamburger ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>

            </div>
        </nav >

            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <ul className="mobile-links">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={() => setMenuOpen(false)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="mobile-actions">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/app" className="btn-login" onClick={() => setMenuOpen(false)}>Detector</Link>
                            <Link to="/history" className="btn-login" onClick={() => setMenuOpen(false)}>History</Link>
                            <Link to="/profile" className="btn-signup" onClick={() => setMenuOpen(false)}>Profile</Link>
                            <button
                                className="btn-login"
                                style={{ border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                                onClick={() => { logout(); setMenuOpen(false); navigate("/"); }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
    </>
  );
}