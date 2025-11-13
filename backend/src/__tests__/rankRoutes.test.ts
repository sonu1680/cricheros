import request from "supertest";
import { POINTS_TABLE } from "../const/pointsTable";
import app from "../utils/app";

describe("calculateTeamPosition API", () => {
  it("should return error for invalid team or opponent", async () => {
    const res = await request(app).post("/api/calculate").send({
      team: "Invalid Team",
      opponent: "Another Invalid Team",
      tossResult: "bat",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid team or opponent name");
  });

  it("should return error for invalid tossResult", async () => {
    const res = await request(app).post("/api/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "invalid_toss",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid toss result");
  });

  it("should calculate rank for batting scenario", async () => {
    const res = await request(app).post("/api/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "bat",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty("summary");
    expect(res.body.result).toHaveProperty("questions");
    expect(Array.isArray(res.body.result.questions)).toBe(true);
    const q = res.body.result.questions[0];
    expect(q).toHaveProperty("minRuns");
    expect(q).toHaveProperty("maxRuns");
    expect(q.minRuns).toBeLessThanOrEqual(q.maxRuns);
  });

  it("should calculate rank for bowling scenario", async () => {
    const res = await request(app).post("/api/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "bowl",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty("summary");
    expect(res.body.result).toHaveProperty("questions");
    expect(Array.isArray(res.body.result.questions)).toBe(true);
    const q = res.body.result.questions[0];
    expect(q).toHaveProperty("minOvers");
    expect(q).toHaveProperty("maxOvers");
    if (q.minOvers !== null && q.maxOvers !== null) {
      expect(q.minOvers).toBeLessThanOrEqual(q.maxOvers);
    }
  });
});
