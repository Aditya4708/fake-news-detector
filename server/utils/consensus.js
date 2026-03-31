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

    // If there are no REAL/FAKE signals, keep UNCERTAIN
    let finalVerdict = "UNCERTAIN";
    let maxWeight = 0;

    if (nonUncertainWeight > 0) {
        if (weights.REAL > weights.FAKE) {
            finalVerdict = "REAL";
            maxWeight = weights.REAL;
        } else if (weights.FAKE > weights.REAL) {
            finalVerdict = "FAKE";
            maxWeight = weights.FAKE;
        } else {
            finalVerdict = "UNCERTAIN";
            maxWeight = weights.UNCERTAIN;
        }

        // Keep uncertain when signal is weak (less than 50% of total weight)
        if (finalVerdict !== "UNCERTAIN" && nonUncertainWeight / totalWeight < 0.5) {
            finalVerdict = "UNCERTAIN";
            maxWeight = weights.UNCERTAIN;
        }

        // If real and fake are tied, choose UNCERTAIN
        if (weights.REAL === weights.FAKE) {
            finalVerdict = "UNCERTAIN";
            maxWeight = weights.UNCERTAIN;
        }
    } else {
        // all uncertain if only uncertain responses exist
        finalVerdict = "UNCERTAIN";
        maxWeight = weights.UNCERTAIN;
    }

    // Calculate consensus score: how much the nodes agree (0–100)
    // Higher score = stronger agreement
    let consensusScore =
        totalWeight > 0
            ? Math.round((maxWeight / totalWeight) * 100)
            : 0;

    // Enforce a confidence floor: when no strong non-UNCERTAIN agreement, mark UNCERTAIN
    if (consensusScore < 50) {
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
