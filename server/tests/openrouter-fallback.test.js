import { fallbackNodeAnalysis } from "../utils/openrouter.js";

describe("fallbackNodeAnalysis", () => {
  it("flags sensational clickbait content as FAKE", () => {
    const result = fallbackNodeAnalysis(0, "You won't believe what happened next in this shocking scandal that broke the internet overnight!");

    expect(result.verdict).toBe("FAKE");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("flags evidence-rich content as REAL", () => {
    const result = fallbackNodeAnalysis(2, "According to official records and a published study, the data shows the policy improved outcomes and the report was confirmed by independent researchers.");

    expect(result.verdict).toBe("REAL");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("flags sensational pseudo-scientific claims as FAKE", () => {
    const article = "New Dream Recording Technology Allows People to Watch Their Dreams Like Videos. A research team in Hyderabad has announced the development of an experimental device that can record and replay human dreams, a breakthrough that could redefine neuroscience and entertainment. The device uses brainwave sensors and artificial intelligence to monitor neural activity during sleep. Researchers claim that the system can reconstruct visual patterns from dreams and convert them into short video clips. According to the team, early testing has shown that the device can capture basic shapes, colors, and motion seen during dreams. The most surprising claim is that future versions may allow users to edit, share, and even rewatch their dreams in high definition.";
    const result = fallbackNodeAnalysis(3, article);

    expect(result.verdict).toBe("FAKE");
    expect(result.confidence).toBeGreaterThan(50);
  });
});
