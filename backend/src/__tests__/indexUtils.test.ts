import { normalizeOver, ballsToOvers, calculateNRR } from "../utils/index";
import { TeamStats } from "../const/types";

describe("normalizeOver", () => {
  it("should convert overs string with decimal to correct float", () => {
    expect(normalizeOver("4.2")).toBeCloseTo(4 + 2 / 6);
    expect(normalizeOver("10.5")).toBeCloseTo(10 + 5 / 6);
  });

  it("should handle overs as number without decimal", () => {
    expect(normalizeOver(6)).toBe(6);
  });

  it("should handle overs with 0 balls", () => {
    expect(normalizeOver("5.0")).toBe(5);
  });
});

describe("ballsToOvers", () => {
  it("should convert balls to overs string format", () => {
    expect(ballsToOvers(26)).toBe(4.2); 
    expect(ballsToOvers(6)).toBe(1.0);
    expect(ballsToOvers(0)).toBe(0.0);
    expect(ballsToOvers(13)).toBe(2.1);
  });
});

describe("calculateNRR", () => {
  it("should calculate NRR correctly", () => {
    const team: TeamStats = {
      name: "TeamA",
      matches: 0,
      won: 0,
      lost: 0,
      nrr: 0,
      runsFor: 120,
      oversFor: 20,
      runsAgainst: 100,
      oversAgainst: 20,
      points: 0,
    };

    const nrr = calculateNRR(team);
    expect(nrr).toBeCloseTo(120 / 20 - 100 / 20);
  });

  it("should handle overs with decimal correctly", () => {
    const team: TeamStats = {
      name: "TeamB",
      matches: 0,
      won: 0,
      lost: 0,
      nrr: 0,
      runsFor: 75,
      oversFor: 10.2, 
      runsAgainst: 70,
      oversAgainst: 10,
      points: 0,
    };

    const nrr = calculateNRR(team);
    expect(nrr).toBeCloseTo(75 / 10.3333 - 70 / 10);
  });
});
