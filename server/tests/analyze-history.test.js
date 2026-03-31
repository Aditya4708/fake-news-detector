import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;
let app;
let authToken;

jest.mock("../utils/openrouter.js", () => ({
  analyzeArticle: jest.fn(async () => [
    { nodeName: "Sentiment Analyzer", nodeIcon: "⚡", nodeColor: "#eab308", verdict: "REAL", confidence: 80, explanation: "Looks reliable", responseTime: 1200, status: "success" },
    { nodeName: "Source Credibility", nodeIcon: "🔎", nodeColor: "#22d3ee", verdict: "REAL", confidence: 70, explanation: "Sources seem valid", responseTime: 1300, status: "success" },
    { nodeName: "Fact Pattern", nodeIcon: "⚖️", nodeColor: "#a78bfa", verdict: "UNCERTAIN", confidence: 40, explanation: "Some odd claims", responseTime: 1100, status: "success" },
    { nodeName: "Bias Detector", nodeIcon: "🧠", nodeColor: "#f472b6", verdict: "REAL", confidence: 65, explanation: "Minimal bias", responseTime: 1400, status: "success" },
  ]),
}));


beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.NODE_ENV = "test";
  process.env.OPENROUTER_API_KEY = "fake-test-key";
  process.env.JWT_SECRET = "test-secret-key";

  const imported = await import("../server.js");
  app = imported.default;

  // Create a test user and obtain token for protected routes
  const signupRes = await request(app).post("/api/auth/signup").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });
  authToken = signupRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe("POST /api/analyze", () => {
  it("returns 400 on too-short text", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ articleText: "short text" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/minimum 20 characters/i);
  });

  it("returns analysis data and saves a search", async () => {
    const longText = "This is a test article content that is definitely longer than twenty characters.";

    const res = await request(app)
      .post("/api/analyze")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ articleText: longText });

    expect(res.status).toBe(200);
    expect(res.body.finalVerdict).toBe("REAL");
    expect(res.body.consensusScore).toBeGreaterThan(0);
    expect(Array.isArray(res.body.nodeResults)).toBe(true);

    // Confirm the saved record exists (via history endpoint)
    const historyRes = await request(app)
      .get("/api/history")
      .set("Authorization", `Bearer ${authToken}`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.searches.length).toBeGreaterThanOrEqual(1);
    expect(historyRes.body.searches[0].finalVerdict).toBe("REAL");
  }, 20000);
});

describe("History route CRUD", () => {
  it("deletes a history record", async () => {
    const historyRes = await request(app)
      .get("/api/history")
      .set("Authorization", `Bearer ${authToken}`);
    const first = historyRes.body.searches[0];
    const deleteRes = await request(app)
      .delete(`/api/history/${first._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/deleted/i);

    const secondFetch = await request(app)
      .get("/api/history")
      .set("Authorization", `Bearer ${authToken}`);
    expect(secondFetch.body.searches.find((s) => s._id === first._id)).toBeUndefined();
  });
});