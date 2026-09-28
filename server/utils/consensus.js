/**
 * Distributed Consensus Voting Engine
 *
 * Implements weighted majority voting across analyzer nodes.
 * Each node's vote is weighted by its confidence score.
 * This simulates a distributed consensus protocol.
 */

function computeConsensus(nodeResults) {
    // Filter out failed nodes
    const validResults = nodeResults.filter((r) => (r.status === "success" || r.status === "fallback") && r.verdict);

    if (validResults.length === 0) {
        return {
            finalVerdict: "UNCERTAIN",
            consensusScore: 0,
            votingDetails: {
                totalNodes: nodeResults.length,
                respondingNodes: 0,
                realVotes: 0,
                fakeVotes: 0,
                uncertainVotes: 0,
                realWeight: 0,
                fakeWeight: 0,
                uncertainWeight: 0,
                agreement: 0,
            },
        };
    }

    // Count raw votes and weighted votes
    const votes = { REAL: 0, FAKE: 0, UNCERTAIN: 0 };
    const weights = { REAL: 0, FAKE: 0, UNCERTAIN: 0 };
    let totalWeight = 0;

    for (const result of validResults) {
        const verdict = String(result.verdict || "UNCERTAIN").toUpperCase();
        const normalizedVerdict = ["REAL", "FAKE", "UNCERTAIN"].includes(verdict) ? verdict : "UNCERTAIN";
        const confidence = Number.isFinite(Number(result.confidence))
            ? Math.max(0, Math.min(100, Number(result.confidence)))
            : 50;

        votes[normalizedVerdict] = (votes[normalizedVerdict] || 0) + 1;
        weights[normalizedVerdict] = (weights[normalizedVerdict] || 0) + confidence;
        totalWeight += confidence;
    }

    const realShare = totalWeight > 0 ? weights.REAL / totalWeight : 0;
    const fakeShare = totalWeight > 0 ? weights.FAKE / totalWeight : 0;
    const nonUncertainShare = (weights.REAL + weights.FAKE) / totalWeight;

    let finalVerdict = "UNCERTAIN";

    // Only downgrade to UNCERTAIN when there is no meaningful REAL/FAKE signal.
    // This prevents moderate evidence from being discarded as ambiguous.
    if (nonUncertainShare >= 0.4) {
        if (weights.REAL > weights.FAKE && realShare > fakeShare && weights.REAL > 0) {
            finalVerdict = "REAL";
        } else if (weights.FAKE > weights.REAL && fakeShare > realShare && weights.FAKE > 0) {
            finalVerdict = "FAKE";
        }
    } else if (weights.REAL > weights.UNCERTAIN && weights.REAL > 0) {
        finalVerdict = "REAL";
    } else if (weights.FAKE > weights.UNCERTAIN && weights.FAKE > 0) {
        finalVerdict = "FAKE";
    }

    // Calculate consensus score: how much the nodes agree (0–100)
    const consensusScore =
        totalWeight > 0
            ? Math.round((weights[finalVerdict] / totalWeight) * 100)
            : 0;

    // Calculate agreement ratio: what percentage of nodes voted the same
    const majorityCount = votes[finalVerdict] || 0;
    const agreement = Math.round((majorityCount / validResults.length) * 100);

    return {
        finalVerdict,
        consensusScore,
        votingDetails: {
            totalNodes: nodeResults.length,
            respondingNodes: validResults.length,
            realVotes: votes.REAL || 0,
            fakeVotes: votes.FAKE || 0,
            uncertainVotes: votes.UNCERTAIN || 0,
            realWeight: Math.round(weights.REAL || 0),
            fakeWeight: Math.round(weights.FAKE || 0),
            uncertainWeight: Math.round(weights.UNCERTAIN || 0),
            agreement,
        },
    };
}

export default computeConsensus;
