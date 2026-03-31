import { motion } from "framer-motion";

const VERDICT_COLORS = {
    REAL: "#22c55e",
    FAKE: "#ef4444",
    UNCERTAIN: "#eab308",
};

export default function NodeCard({ result, index = 0 }) {
    const verdictColor = VERDICT_COLORS[result.verdict] || VERDICT_COLORS.UNCERTAIN;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1.25rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top color accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${result.nodeColor || verdictColor}, transparent)`,
                    opacity: 0.6,
                }}
            />

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{result.nodeIcon || "🔍"}</span>
                    <span
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            color: "#fafafa",
                        }}
                    >
                        {result.nodeName}
                    </span>
                </div>
                <span
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        letterSpacing: "1.5px",
                        color: verdictColor,
                        background: `${verdictColor}15`,
                        border: `1px solid ${verdictColor}30`,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                    }}
                >
                    {result.verdict}
                </span>
            </div>

            {/* Confidence bar */}
            <div style={{ marginBottom: "0.75rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.62rem",
                            color: "#52525b",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}
                    >
                        Confidence
                    </span>
                    <span
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: verdictColor,
                        }}
                    >
                        {result.confidence}%
                    </span>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "4px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "2px",
                        overflow: "hidden",
                    }}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: "easeOut" }}
                        style={{
                            height: "100%",
                            background: verdictColor,
                            borderRadius: "2px",
                            boxShadow: `0 0 8px ${verdictColor}40`,
                        }}
                    />
                </div>
            </div>

            {/* Explanation */}
            <p
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.72rem",
                    color: "#71717a",
                    lineHeight: 1.7,
                    letterSpacing: "0.2px",
                }}
            >
                {result.explanation}
            </p>

            {/* Response time */}
            {result.responseTime && (
                <div
                    style={{
                        marginTop: "0.75rem",
                        fontSize: "0.6rem",
                        color: "#3f3f46",
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "0.5px",
                    }}
                >
                    ⏱ {(result.responseTime / 1000).toFixed(1)}s
                </div>
            )}
        </motion.div>
    );
}
