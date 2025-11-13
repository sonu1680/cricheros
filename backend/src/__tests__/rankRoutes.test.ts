import request from "supertest";
import express from "express";
import { calculateRank } from "../controllers/calculateRank";
import { POINTS_TABLE } from "../const/pointsTable";

// Mock services
jest.mock("../services/matchSimulation/battingSimulation", () => ({
  simulateBattingScenario: jest.fn(() => ({ position: 2, nrr: 0.5 })),
}));

jest.mock("../services/matchSimulation/bowlingSimulation", () => ({
  simulateBowlingScenario: jest.fn(() => ({ position: 3, nrr: 0.3 })),
}));

describe("calculateRank API", () => {
  const app = express();
  app.use(express.json());
  app.post("/calculate", calculateRank);

  it("should return error for invalid team", async () => {
    const res = await request(app).post("/calculate").send({
      team: "InvalidTeam",
      opponent: POINTS_TABLE[0].name,
      tossResult: "bat",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid team or opponent name");
  });

  it("should return error for invalid tossResult", async () => {
    const res = await request(app).post("/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "invalid",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(
      "Invalid tossResult value. Expected 'bat' or 'bowl'."
    );
  });

  it("should calculate rank for batting scenario", async () => {
    const res = await request(app).post("/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "bat",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toEqual({ position: 2, nrr: 0.5 });
  });

  it("should calculate rank for bowling scenario", async () => {
    const res = await request(app).post("/calculate").send({
      team: POINTS_TABLE[0].name,
      opponent: POINTS_TABLE[1].name,
      tossResult: "bowl",
      runsScored: 100,
      overs: 20,
      desiredPosition: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.result).toEqual({ position: 3, nrr: 0.3 });
  });
});
