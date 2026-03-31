import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Network, ArrowRight, BarChart2, CheckCircle } from "lucide-react";

const NODES = [
    { id: 0, label: "Sentiment", color: "#eab308", icon: "⚡", desc: "Detects emotional manipulation & fear-baiting" },
    { id: 1, label: "Source", color: "#22d3ee", icon: "🔎", desc: "Checks citation patterns & source credibility" },
    { id: 2, label: "Fact Pattern", color: "#a78bfa", icon: "⚖️", desc: "Finds logical inconsistencies & contradictions" },
    { id: 3, label: "Bias", color: "#f472b6", icon: "🧠", desc: "Spots propaganda & loaded language" },
];

const STATS = [
    { value: "4", label: "AI Nodes", icon: Network },
    { value: "~8s", label: "Avg Analysis", icon: Zap },
    { value: "Parallel", label: "Processing", icon: BarChart2 },
    { value: "100%", label: "Logged", icon: CheckCircle },
];

function FloatingPaths({ position }) {
    const paths = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.3 + i * 0.02,
    }));
    return (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4 }}>
            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 696 316" fill="none">
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="rgba(234,179,8,0.3)"
                        strokeWidth={path.width}
                        initial={{ pathLength: 0.3, opacity: 0.3 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.2, 0.5, 0.2],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

function NodeCard({ node, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
            }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                opacity: 0.6,
            }} />
            <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: `${node.color}15`,
                border: `1px solid ${node.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", marginBottom: "0.75rem",
            }}>
                {node.icon}
            </div>
            <p style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                color: "#fafafa", fontSize: "0.95rem", marginBottom: "0.4rem",
            }}>
                {node.label} Analyzer
            </p>
            <p style={{
                fontFamily: "'Inter', sans-serif", color: "#52525b",
                fontSize: "0.72rem", lineHeight: 1.6, letterSpacing: "0.3px",
            }}>
                {node.desc}
            </p>
            <div style={{
                marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem",
                fontFamily: "'Inter', sans-serif", fontSize: "0.65rem",
                color: node.color, letterSpacing: "1px", textTransform: "uppercase",
            }}>
                <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: node.color, boxShadow: `0 0 6px ${node.color}`,
                }} />
                Node {node.id + 1} active
            </div>
        </motion.div>
    );
}

export default function Landing() {
    const [demoState, setDemoState] = useState("idle");
    const [activeNodes, setActiveNodes] = useState([]);
    const [verdict, setVerdict] = useState(null);

    const runDemo = () => {
        if (demoState !== "idle") return;
        setDemoState("running");
        setActiveNodes([]);
        setVerdict(null);
        [0, 1, 2, 3].forEach((i) => {
            setTimeout(() => setActiveNodes((prev) => [...prev, i]), i * 500);
        });
        setTimeout(() => { setVerdict("FAKE"); setDemoState("done"); }, 2800);
        setTimeout(() => { setDemoState("idle"); setActiveNodes([]); setVerdict(null); }, 5500);
    };

    const words = "Detect Fake News with Distributed AI".split(" ");

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          background: #080808;
          color: #fafafa;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 6rem 2rem 4rem;
        }
        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(234,179,8,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .hero-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(234,179,8,0.08);
          border: 1px solid rgba(234,179,8,0.2);
          border-radius: 100px;
          padding: 0.35rem 1rem;
          font-size: 0.7rem;
          color: #a16207;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #eab308;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 1.5rem;
        }
        .hero-sub {
          color: #71717a;
          font-size: 0.9rem;
          line-height: 1.8;
          max-width: 520px;
          margin: 0 auto 2.5rem;
          letter-spacing: 0.3px;
        }
        .hero-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #eab308;
          color: #0a0a0a;
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .cta-primary:hover {
          background: #ca8a04;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(234,179,8,0.25);
        }
        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #a1a1aa;
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        .cta-secondary:hover {
          color: #fafafa;
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.04);
        }
        .stats-strip {
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          padding: 2rem;
        }
        .stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stat-item {
          text-align: center;
          padding: 1rem;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #eab308;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .stat-label {
          font-size: 0.68rem;
          color: #52525b;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 0.68rem;
          color: #eab308;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800;
          color: #fafafa;
          letter-spacing: -1px;
          margin-bottom: 1rem;
          max-width: 500px;
        }
        .section-desc {
          color: #52525b;
          font-size: 0.8rem;
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 3rem;
          letter-spacing: 0.3px;
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 5rem;
        }
        .step-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.75rem;
        }
        .step-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: rgba(234,179,8,0.1);
          line-height: 1;
          margin-bottom: 1rem;
        }
        .step-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: #fafafa;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .step-desc {
          color: #52525b;
          font-size: 0.75rem;
          line-height: 1.7;
          letter-spacing: 0.3px;
        }
        .demo-widget {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .demo-label {
          font-size: 0.65rem;
          color: #52525b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .demo-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .demo-nodes {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .demo-node {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 0.75rem;
          text-align: center;
          transition: all 0.3s;
          font-size: 0.68rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .demo-node.active {
          border-color: var(--nc);
          background: color-mix(in srgb, var(--nc) 8%, transparent);
          box-shadow: 0 0 15px color-mix(in srgb, var(--nc) 15%, transparent);
        }
        .demo-node-icon { font-size: 1.2rem; margin-bottom: 0.3rem; display: block; }
        .demo-node-name { color: #52525b; }
        .demo-node.active .demo-node-name { color: var(--nc); }
        .demo-verdict {
          text-align: center;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 2px;
          transition: all 0.5s;
        }
        .demo-verdict.fake {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
        }
        .demo-verdict.hidden {
          opacity: 0;
          height: 0;
          padding: 0;
          overflow: hidden;
        }
        .demo-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(234,179,8,0.1);
          border: 1px solid rgba(234,179,8,0.2);
          color: #eab308;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          margin: 1rem auto 0;
          width: fit-content;
        }
        .demo-btn:hover:not(:disabled) {
          background: rgba(234,179,8,0.15);
          border-color: rgba(234,179,8,0.4);
        }
        .demo-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .nodes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .cta-section {
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(234,179,8,0.04) 0%, transparent 70%);
        }
        .cta-section .section-title {
          max-width: 100%;
          text-align: center;
          margin: 0 auto 1rem;
        }
        .cta-section .section-desc {
          text-align: center;
          margin: 0 auto 2rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 12px; height: 12px;
          border: 2px solid rgba(234,179,8,0.2);
          border-top-color: #eab308;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @media (max-width: 900px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .steps { grid-template-columns: 1fr 1fr; }
          .nodes-grid { grid-template-columns: repeat(2, 1fr); }
          .demo-nodes { grid-template-columns: repeat(2, 1fr); }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        }
        @media (max-width: 600px) {
          .steps { grid-template-columns: 1fr; }
          .nodes-grid { grid-template-columns: 1fr 1fr; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

            <div className="landing-root">

                {/* HERO */}
                <section className="hero">
                    <div className="hero-bg-grid" />
                    <div className="hero-glow" />
                    <FloatingPaths position={1} />
                    <FloatingPaths position={-1} />

                    <div className="hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="hero-badge">
                                <span className="hero-badge-dot" />
                                Distributed AI Detection Network
                            </div>
                        </motion.div>

                        <h1 className="hero-title">
                            {words.map((word, wi) => (
                                <span key={wi} style={{ display: "inline-block", marginRight: "0.3em" }}>
                                    {word.split("").map((letter, li) => (
                                        <motion.span
                                            key={`${wi}-${li}`}
                                            initial={{ y: 60, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: wi * 0.08 + li * 0.025,
                                                type: "spring",
                                                stiffness: 160,
                                                damping: 25,
                                            }}
                                            style={{
                                                display: "inline-block",
                                                color: word === "Fake" ? "#eab308" : undefined,
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </h1>

                        <motion.p
                            className="hero-sub"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            4 specialized AI nodes analyze your article simultaneously — checking sentiment, sources, facts, and bias. Consensus voting delivers a final verdict.
                        </motion.p>

                        <motion.div
                            className="hero-ctas"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <Link to="/signup" className="cta-primary">
                                Start Analyzing <ArrowRight size={16} />
                            </Link>
                            <a href="#how-it-works" className="cta-secondary">
                                How It Works
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* STATS */}
                <div className="stats-strip">
                    <div className="stats-inner">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-item"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* HOW IT WORKS */}
                <section className="section" id="how-it-works">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-label">// How It Works</p>
                        <h2 className="section-title">Three steps to the truth</h2>
                        <p className="section-desc">
                            Paste any article or headline. Our distributed node network fires simultaneously and reaches consensus in seconds.
                        </p>
                    </motion.div>

                    <div className="steps">
                        {[
                            { n: "01", t: "Paste Your Article", d: "Drop in any news article, headline, or suspicious text you want analyzed." },
                            { n: "02", t: "Nodes Analyze in Parallel", d: "4 AI nodes fire simultaneously — each checking a different signal independently." },
                            { n: "03", t: "Consensus Verdict", d: "Weighted voting across all nodes produces a final REAL / FAKE / UNCERTAIN verdict." },
                        ].map((step, i) => (
                            <motion.div
                                key={step.n}
                                className="step-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="step-number">{step.n}</div>
                                <div className="step-title">{step.t}</div>
                                <div className="step-desc">{step.d}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DEMO WIDGET */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="demo-widget">
                            <div className="demo-label">Live Demo Preview</div>
                            <div className="demo-nodes">
                                {NODES.map((node, i) => (
                                    <div
                                        key={node.id}
                                        className={`demo-node ${activeNodes.includes(i) ? "active" : ""}`}
                                        style={{ "--nc": node.color }}
                                    >
                                        <span className="demo-node-icon">{node.icon}</span>
                                        <div className="demo-node-name">{node.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={`demo-verdict ${verdict === "FAKE" ? "fake" : "hidden"}`}>
                                {verdict && `⚠ VERDICT: ${verdict} NEWS DETECTED`}
                            </div>
                            <button
                                className="demo-btn"
                                onClick={runDemo}
                                disabled={demoState !== "idle"}
                            >
                                {demoState === "running" ? (
                                    <><span className="spinner" /> Analyzing...</>
                                ) : demoState === "done" ? (
                                    "✓ Analysis Complete"
                                ) : (
                                    <><Zap size={12} /> Run Demo Analysis</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* 4 NODES */}
                <section className="section" style={{ paddingTop: 0 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-label">// The Network</p>
                        <h2 className="section-title">4 specialized analyzer nodes</h2>
                        <p className="section-desc">
                            Each node is an independent AI agent with a unique analytical focus. All fire in parallel.
                        </p>
                    </motion.div>
                    <div className="nodes-grid">
                        {NODES.map((node, i) => (
                            <NodeCard key={node.id} node={node} index={i} />
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="cta-section">
                    <div className="cta-bg" />
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ position: "relative", zIndex: 1 }}
                    >
                        <p className="section-label" style={{ textAlign: "center" }}>// Get Started</p>
                        <h2 className="section-title">Ready to detect the truth?</h2>
                        <p className="section-desc">
                            Create a free account and start analyzing articles in under 60 seconds.
                        </p>
                        <div className="hero-ctas">
                            <Link to="/signup" className="cta-primary">
                                Create Free Account <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="cta-secondary">
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </section>

            </div>
        </>
    );
}