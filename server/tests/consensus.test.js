import computeConsensus from "../utils/consensus.js";

describe("computeConsensus", () => {
  it("returns REAL when weighted REAL is strongest", () => {
    const nodeResults = [
      { nodeName: "Sentiment", verdict: "REAL", confidence: 80, status: "success" },
      { nodeName: "Source", verdict: "REAL", confidence: 70, status: "success" },
      { nodeName: "Fact Pattern", verdict: "FAKE", confidence: 50, status: "success" },
      { nodeName: "Bias", verdict: "UNCERTAIN", confidence: 30, status: "success" },
    ];

    const { finalVerdict, consensusScore, votingDetails } = computeConsensus(nodeResults);

    expect(finalVerdict).toBe("REAL");
    expect(consensusScore).toBeGreaterThan(50);
    expect(votingDetails.realVotes).toBe(2);
    expect(votingDetails.fakeVotes).toBe(1);
    expect(votingDetails.uncertainVotes).toBe(1);
  });

  it("returns UNCERTAIN when tie happens", () => {
    const nodeResults = [
      { nodeName: "Sentiment", verdict: "REAL", confidence: 50, status: "success" },
      { nodeName: "Source", verdict: "FAKE", confidence: 50, status: "success" },
      { nodeName: "Fact Pattern", verdict: "UNCERTAIN", confidence: 50, status: "success" },
    ];

    const { finalVerdict } = computeConsensus(nodeResults);
    expect(finalVerdict).toBe("UNCERTAIN");
  });

  it("returns UNCERTAIN when all nodes fail", () => {
    const nodeResults = [
      { nodeName: "Sentiment", verdict: "UNCERTAIN", confidence: 0, status: "error" },
      { nodeName: "Source", verdict: "UNCERTAIN", confidence: 0, status: "error" },
      { nodeName: "Fact Pattern", verdict: "UNCERTAIN", confidence: 0, status: "error" },
      { nodeName: "Bias", verdict: "UNCERTAIN", confidence: 0, status: "error" },
    ];

    const { finalVerdict, consensusScore, votingDetails } = computeConsensus(nodeResults);
    expect(finalVerdict).toBe("UNCERTAIN");
    expect(consensusScore).toBe(0);
    expect(votingDetails.respondingNodes).toBe(0);
  });

  it("returns FAKE when one FAKE node dominates several UNCERTAIN nodes", () => {
    const nodeResults = [
      { nodeName: "Sentiment", verdict: "UNCERTAIN", confidence: 20, status: "success" },
      { nodeName: "Source", verdict: "UNCERTAIN", confidence: 20, status: "success" },
      { nodeName: "Fact Pattern", verdict: "FAKE", confidence: 80, status: "success" },
      { nodeName: "Bias", verdict: "UNCERTAIN", confidence: 10, status: "success" },
    ];

    const { finalVerdict, consensusScore, votingDetails } = computeConsensus(nodeResults);
    expect(finalVerdict).toBe("FAKE");
    expect(consensusScore).toBeGreaterThanOrEqual(50);
    expect(votingDetails.fakeVotes).toBe(1);
    expect(votingDetails.uncertainVotes).toBe(3);
  });

  it("returns UNCERTAIN for low-confidence REAL/FAKE signal under threshold", () => {
    const nodeResults = [
      { nodeName: "Sentiment", verdict: "REAL", confidence: 35, status: "success" },
      { nodeName: "Source", verdict: "UNCERTAIN", confidence: 35, status: "success" },
      { nodeName: "Fact Pattern", verdict: "UNCERTAIN", confidence: 30, status: "success" },
      { nodeName: "Bias", verdict: "UNCERTAIN", confidence: 0, status: "success" },
    ];

    const { finalVerdict, consensusScore } = computeConsensus(nodeResults);
    expect(finalVerdict).toBe("UNCERTAIN");
    expect(consensusScore).toBe(65);
  });
});