import { motion } from "framer-motion";

const VERDICT_COLORS = {
    REAL: "#22c55e",
    FAKE: "#ef4444",
    UNCERTAIN: "#eab308",
};

export default function VotingBreakdown({ votingDetails, nodeResults = [] }) {
    if (!votingDetails) return null;

    const { realVotes, fakeVotes, uncertainVotes, realWeight, fakeWeight, uncertainWeight, respondingNodes, agreement } = votingDetails;
    const totalWeight = realWeight + fakeWeight + uncertainWeight || 1;

    const bars = [
        { label: "REAL", votes: realVotes, weight: realWeight, color: VERDICT_COLORS.REAL },
        { label: "FAKE", votes: fakeVotes, weight: fakeWeight, color: VERDICT_COLORS.FAKE },
        { label: "UNCERTAIN", votes: uncertainVotes, weight: uncertainWeight, color: VERDICT_COLORS.UNCERTAIN },
    ].filter((b) => b.votes > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "1.5rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.25rem",
                }}
            >
                <h3
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#fafafa",
                    }}
                >
                    🗳️ Voting Breakdown
                </h3>
                <span
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.62rem",
                        color: "#52525b",
                        letterSpacing: "1px",
                    }}
                >
                    {respondingNodes}/4 NODES
                </span>
            </div>

            {/* Weight bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {bars.map((bar) => (
                    <div key={bar.label}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "0.3rem",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    color: bar.color,
                                    letterSpacing: "1px",
                                }}
                            >
                                {bar.label}
                            </span>
                            <span
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.65rem",
                                    color: "#52525b",
                                }}
                            >
                                {bar.votes} vote{bar.votes !== 1 ? "s" : ""} · {Math.round((bar.weight / totalWeight) * 100)}% weight
                            </span>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: "6px",
                                background: "rgba(255,255,255,0.04)",
                                borderRadius: "3px",
                                overflow: "hidden",
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(bar.weight / totalWeight) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{
                                    height: "100%",
                                    background: bar.color,
                                    borderRadius: "3px",
                                    boxShadow: `0 0 8px ${bar.color}30`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Agreement score */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.04)",
                }}
            >
                <span style={{ fontSize: "0.65rem", color: "#52525b", fontFamily: "'Inter', sans-serif", letterSpacing: "0.5px" }}>
                    Node Agreement:
                </span>
                <span
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: agreement >= 75 ? "#22c55e" : agreement >= 50 ? "#eab308" : "#ef4444",
                    }}
                >
                    {agreement}%
                </span>
            </div>
        </motion.div>
    );
}
