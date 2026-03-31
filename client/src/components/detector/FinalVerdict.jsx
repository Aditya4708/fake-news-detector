import { motion } from "framer-motion";

const VERDICT_CONFIG = {
    REAL: {
        color: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
        border: "rgba(34,197,94,0.2)",
        icon: "✓",
        label: "REAL NEWS",
        desc: "The distributed network consensus indicates this article is likely authentic.",
    },
    FAKE: {
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.2)",
        icon: "⚠",
        label: "FAKE NEWS DETECTED",
        desc: "The distributed network consensus indicates this article shows signs of misinformation.",
    },
    UNCERTAIN: {
        color: "#eab308",
        bg: "rgba(234,179,8,0.08)",
        border: "rgba(234,179,8,0.2)",
        icon: "?",
        label: "UNCERTAIN",
        desc: "The nodes did not reach a clear consensus. Manual verification recommended.",
    },
};

export default function FinalVerdict({ verdict, consensusScore, totalTime }) {
    const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.UNCERTAIN;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "200px",
                    height: "200px",
                    background: `radial-gradient(circle, ${config.color}10 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            {/* Verdict icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: `${config.color}20`,
                    border: `2px solid ${config.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    margin: "0 auto 1rem",
                    color: config.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                }}
            >
                {config.icon}
            </motion.div>

            {/* Verdict text */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: config.color,
                    letterSpacing: "2px",
                    marginBottom: "0.5rem",
                }}
            >
                {config.label}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#71717a",
                    lineHeight: 1.7,
                    maxWidth: "400px",
                    margin: "0 auto 1.25rem",
                }}
            >
                {config.desc}
            </motion.p>

            {/* Stats row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2rem",
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 800,
                            fontSize: "1.5rem",
                            color: config.color,
                        }}
                    >
                        {consensusScore}%
                    </div>
                    <div
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.6rem",
                            color: "#52525b",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}
                    >
                        Consensus Score
                    </div>
                </div>
                {totalTime && (
                    <div>
                        <div
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 800,
                                fontSize: "1.5rem",
                                color: "#fafafa",
                            }}
                        >
                            {(totalTime / 1000).toFixed(1)}s
                        </div>
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.6rem",
                                color: "#52525b",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                            }}
                        >
                            Total Time
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
