import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap } from "lucide-react";

// Brand icons are no longer in lucide-react; define small inline SVGs
const GithubSvg = ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .3a12 12 0 00-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18a4.65 4.65 0 011.23 3.22c0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.22.69.83.57A12 12 0 0012 .3" />
    </svg>
);
const TwitterSvg = ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const LinkedinSvg = ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const footerLinks = [
    {
        label: "Product",
        links: [
            { title: "How It Works", href: "/#how-it-works" },
            { title: "Detector", href: "/app" },
            { title: "History", href: "/history" },
        ],
    },
    {
        label: "Company",
        links: [
            { title: "About", href: "/about" },
            { title: "Privacy Policy", href: "/privacy" },
            { title: "Terms of Service", href: "/terms" },
        ],
    },
    {
        label: "Connect",
        links: [
            { title: "GitHub", href: "#", icon: GithubSvg },
            { title: "Twitter", href: "#", icon: TwitterSvg },
            { title: "LinkedIn", href: "#", icon: LinkedinSvg },
        ],
    },
];

function AnimatedContainer({ children, delay = 0.1, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.7 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function Footer() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .footer-root {
          width: 100%;
          background: #080808;
          border-top: 1px solid rgba(234,179,8,0.12);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .footer-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          width: 400px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(234,179,8,0.4), transparent);
          filter: blur(1px);
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 1rem;
        }
        .footer-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #eab308, #ca8a04);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #0a0a0a;
        }
        .footer-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #fafafa;
        }
        .footer-logo-text span { color: #eab308; }
        .footer-tagline {
          color: #52525b;
          font-size: 0.75rem;
          line-height: 1.6;
          max-width: 220px;
          letter-spacing: 0.3px;
        }
        .footer-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .footer-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(234,179,8,0.08);
          border: 1px solid rgba(234,179,8,0.15);
          border-radius: 4px;
          padding: 0.25rem 0.6rem;
          font-size: 0.65rem;
          color: #a16207;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .footer-section-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: #fafafa;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-link-list a {
          color: #52525b;
          text-decoration: none;
          font-size: 0.78rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }
        .footer-link-list a:hover { color: #eab308; }
        .footer-link-list a svg { width: 13px; height: 13px; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-copy {
          color: #3f3f46;
          font-size: 0.72rem;
          letter-spacing: 0.5px;
        }
        .footer-copy span { color: #52525b; }
        .footer-node-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.68rem;
          color: #52525b;
          letter-spacing: 0.5px;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <footer className="footer-root">
                <div className="footer-glow" />
                <div className="footer-inner">
                    <div className="footer-grid">
                        <AnimatedContainer delay={0.05}>
                            <Link to="/" className="footer-brand-logo">
                                <div className="footer-logo-icon">TN</div>
                                <span className="footer-logo-text">Truth<span>Net</span></span>
                            </Link>
                            <p className="footer-tagline">
                                Distributed AI-powered fake news detection. 4 nodes. One truth.
                            </p>
                            <div className="footer-badges">
                                <span className="footer-badge">
                                    <ShieldCheck size={10} /> Verified
                                </span>
                                <span className="footer-badge">
                                    <Zap size={10} /> 4 AI Nodes
                                </span>
                            </div>
                        </AnimatedContainer>

                        {footerLinks.map((section, i) => (
                            <AnimatedContainer key={section.label} delay={0.1 + i * 0.1}>
                                <p className="footer-section-label">{section.label}</p>
                                <ul className="footer-link-list">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a href={link.href}>
                                                {link.icon && <link.icon size={13} />}
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </AnimatedContainer>
                        ))}
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copy">
                            © {new Date().getFullYear()} TruthNet. All rights reserved.{" "}
                            <span>Built for distributed computing.</span>
                        </p>
                        <div className="footer-node-status">
                            <span className="status-dot" />
                            ALL 4 NODES OPERATIONAL
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}