/**
 * Distributed Consensus Voting Engine
 *
 * Implements weighted majority voting across analyzer nodes.
 * Each node's vote is weighted by its confidence score.
 * This simulates a distributed consensus protocol.
 */

function computeConsensus(nodeResults) {
    // Filter out failed nodes
    const validResults = nodeResults.filter((r) => r.status === "success");

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
        const v = result.verdict;
        votes[v] = (votes[v] || 0) + 1;
        weights[v] = (weights[v] || 0) + result.confidence;
        totalWeight += result.confidence;
    }

    // Determine winner by weighted voting
    const nonUncertainWeight = weights.REAL + weights.FAKE;
    let finalVerdict = "UNCERTAIN";
    let maxWeight = weights.UNCERTAIN;

    if (nonUncertainWeight > 0) {
        const fakeRatio = weights.FAKE / totalWeight;

        // Bias towards FAKE: any significant fake signal (>= 30% of total vote weight)
        // indicates a mixed or partially deceptive article, which MUST be flagged as FAKE.
        if (weights.FAKE >= weights.REAL || fakeRatio >= 0.3) {
            finalVerdict = "FAKE";
            maxWeight = weights.FAKE;
        } else {
            finalVerdict = "REAL";
            maxWeight = weights.REAL;
        }

        // Keep uncertain when REAL signal is weak (less than 50% of total weight). 
        // We do NOT apply this strict floor to FAKE, as we want to loudly flag subtle/mixed manipulation.
        if (finalVerdict === "REAL" && nonUncertainWeight / totalWeight < 0.5) {
            finalVerdict = "UNCERTAIN";
            maxWeight = weights.UNCERTAIN;
        }
    }

    // Calculate consensus score: how much the nodes agree (0–100)
    let consensusScore =
        totalWeight > 0
            ? Math.round((weights[finalVerdict] / totalWeight) * 100)
            : 0;

    // Fix UI logic: If we flagged as FAKE due to our mixed-content threshold (>=30%), 
    // the maxWeight mathematically might be low, which could visually confuse users.
    // Boost consensusScore to minimum 51% if it was successfully deemed FAKE.
    if (finalVerdict === "FAKE") {
        consensusScore = Math.max(consensusScore, 51);
    }

    // Enforce a confidence floor for REAL and UNCERTAIN
    if (finalVerdict !== "FAKE" && consensusScore < 50) {
        finalVerdict = "UNCERTAIN";
        consensusScore = Math.round((weights.UNCERTAIN / totalWeight) * 100);
    }

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
