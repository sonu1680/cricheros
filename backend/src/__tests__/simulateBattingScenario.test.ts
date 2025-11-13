import { POINTS_TABLE } from "../const/pointsTable";
import { simulateBattingScenario } from "../services/simulateBattingScenario";

describe("simulateBattingScenario", () => {
  const myTeam = POINTS_TABLE[3]; // Rajasthan Royals
  const opponent = POINTS_TABLE[2]; // Delhi Capitals

  it("should return valid min/max runs and NRR for a normal scenario", () => {
    const runsScored = 120;
    const overs = 20;
    const desiredPosition = 3;

    const result = simulateBattingScenario(
      myTeam.name,
      opponent.name,
      myTeam,
      opponent,
      runsScored,
      overs,
      desiredPosition
    );
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("questions");

    // Ensure questions exists
    if (result.questions && result.questions.length > 0) {
      const q = result.questions[0];

      // Guard against null values
      if (q.minRuns !== null && q.maxRuns !== null) {
        expect(q.minRuns).toBeLessThanOrEqual(q.maxRuns);
      }

      if (q.minNRR !== null && q.maxNRR !== null) {
        expect(q.minNRR).toBeGreaterThanOrEqual(0);
        expect(q.maxNRR).toBeGreaterThanOrEqual(0);
      }

      expect(result.summary.message).toContain(myTeam.name);
      expect(result.summary.message).toContain(opponent.name);
    } else {
      throw new Error("Questions array is undefined or empty");
    }
  });

  it("should return 'Not achievable' if desired position is impossible", () => {
    const runsScored = 50; // very low runs, may not reach desired position
    const overs = 20;
    const desiredPosition = 1;

    const result = simulateBattingScenario(
      myTeam.name,
      opponent.name,
      myTeam,
      opponent,
      runsScored,
      overs,
      desiredPosition
    );

    expect(result).toHaveProperty("summary");
    expect(result.summary.message).toBe("Not achievable with given data");
  });

  it("minRuns should be less than or equal to maxRuns", () => {
    const runsScored = 120;
    const overs = 20;
    const desiredPosition = 3;

    const result = simulateBattingScenario(
      myTeam.name,
      opponent.name,
      myTeam,
      opponent,
      runsScored,
      overs,
      desiredPosition
    );

    if (result.questions && result.questions.length > 0) {
      const q = result.questions[0];
      if (q.minRuns !== null && q.maxRuns !== null) {
        expect(q.minRuns).toBeLessThanOrEqual(q.maxRuns);
      }
    } else {
      throw new Error("Questions array is undefined or empty");
    }
  });
});
