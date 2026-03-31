import { motion } from "framer-motion";
import AnalyzerNode from "./AnalyzerNode";

const NODES = [
    { name: "Sentiment", icon: "⚡", color: "#eab308" },
    { name: "Source", icon: "🔎", color: "#22d3ee" },
    { name: "Fact Pattern", icon: "⚖️", color: "#a78bfa" },
    { name: "Bias", icon: "🧠", color: "#f472b6" },
];

export default function NetworkVisualizer({ nodeStatuses = [], phase = "idle" }) {
    // nodeStatuses: array of "waiting" | "analyzing" | "done" | "error"
    const statuses = NODES.map((_, i) => nodeStatuses[i] || "waiting");

    return (
        <div style={{ padding: "2rem 0" }}>
            {/* Label */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    color: "#52525b",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                }}
            >
                <span
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: phase === "analyzing" ? "#eab308" : "#3f3f46",
                        boxShadow: phase === "analyzing" ? "0 0 8px rgba(234,179,8,0.5)" : "none",
                        animation: phase === "analyzing" ? "blink 1.2s infinite" : "none",
                    }}
                />
                {phase === "idle" && "Distributed Node Network"}
                {phase === "analyzing" && "Nodes Processing in Parallel..."}
                {phase === "done" && "All Nodes Responded"}
            </div>

            {/* Node grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                }}
            >
                {NODES.map((node, i) => (
                    <AnalyzerNode
                        key={node.name}
                        node={node}
                        status={statuses[i]}
                        index={i}
                    />
                ))}
            </div>

            {/* Connection lines visualization */}
            {phase !== "idle" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.62rem",
                        color: "#3f3f46",
                        letterSpacing: "1px",
                    }}
                >
                    <span style={{
                        flex: 1,
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.2), transparent)",
                    }} />
                    <span>CONSENSUS LAYER</span>
                    <span style={{
                        flex: 1,
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.2), transparent)",
                    }} />
                </motion.div>
            )}
        </div>
    );
}
