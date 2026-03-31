import { motion } from "framer-motion";

const STATUS_STYLES = {
    waiting: { borderColor: "rgba(255,255,255,0.06)", glow: "transparent" },
    analyzing: { borderColor: "var(--nc)", glow: "var(--nc)" },
    done: { borderColor: "var(--nc)", glow: "var(--nc)" },
    error: { borderColor: "rgba(239,68,68,0.4)", glow: "rgba(239,68,68,0.2)" },
};

export default function AnalyzerNode({ node, status = "waiting", index = 0 }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES.waiting;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            style={{
                "--nc": node.color || "#eab308",
                background: status === "analyzing"
                    ? `color-mix(in srgb, ${node.color} 6%, transparent)`
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${s.borderColor}`,
                borderRadius: "12px",
                padding: "1.25rem",
                textAlign: "center",
                transition: "all 0.4s ease",
                position: "relative",
                overflow: "hidden",
                boxShadow: status === "analyzing"
                    ? `0 0 20px ${s.glow}20`
                    : "none",
            }}
        >
            {/* Top accent bar */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: status !== "waiting"
                        ? `linear-gradient(90deg, transparent, ${node.color}, transparent)`
                        : "transparent",
                    opacity: 0.7,
                    transition: "all 0.4s",
                }}
            />

            {/* Icon */}
            <div
                style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    opacity: status === "waiting" ? 0.4 : 1,
                    transition: "opacity 0.3s",
                }}
            >
                {node.icon}
            </div>

            {/* Name */}
            <div
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    letterSpacing: "0.5px",
                    color: status === "waiting" ? "#52525b" : "#fafafa",
                    transition: "color 0.3s",
                    marginBottom: "0.5rem",
                }}
            >
                {node.name}
            </div>

            {/* Status indicator */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    fontSize: "0.62rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: status === "waiting" ? "#3f3f46" : node.color,
                }}
            >
                {status === "analyzing" && (
                    <span
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            border: `2px solid ${node.color}40`,
                            borderTopColor: node.color,
                            animation: "spin 0.7s linear infinite",
                        }}
                    />
                )}
                {status === "done" && (
                    <span
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: node.color,
                            boxShadow: `0 0 6px ${node.color}`,
                        }}
                    />
                )}
                {status === "error" && "✕"}
                {status === "waiting" && "standby"}
                {status === "analyzing" && "processing"}
                {status === "done" && "complete"}
                {status === "error" && " failed"}
            </div>
        </motion.div>
    );
}
