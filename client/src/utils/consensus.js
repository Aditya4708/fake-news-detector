/**
 * Client-side consensus display helpers
 */

export const VERDICT_COLORS = {
    REAL: "#22c55e",
    FAKE: "#ef4444",
    UNCERTAIN: "#eab308",
};

export const VERDICT_LABELS = {
    REAL: "Real News",
    FAKE: "Fake News Detected",
    UNCERTAIN: "Uncertain",
};

export function getVerdictColor(verdict) {
    return VERDICT_COLORS[verdict] || VERDICT_COLORS.UNCERTAIN;
}

export function getConsensusLabel(score) {
    if (score >= 90) return "Very Strong Consensus";
    if (score >= 75) return "Strong Consensus";
    if (score >= 60) return "Moderate Consensus";
    if (score >= 40) return "Weak Consensus";
    return "No Consensus";
}

export function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}
