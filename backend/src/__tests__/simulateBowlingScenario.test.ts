import { POINTS_TABLE } from "../const/pointsTable";
import { simulateBowlingScenario } from "../services/simulateBowlingScenario";

describe("simulateBowlingScenario", () => {
  const myTeam = POINTS_TABLE[3]; // Rajasthan Royals
  const opponent = POINTS_TABLE[2]; // Delhi Capitals

  it("should return valid min/max overs and NRR for a normal scenario", () => {
    const runsScored = 119;
    const overs = 20;
    const desiredPosition = 3;

    const result = simulateBowlingScenario(
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

    if (result.questions && result.questions.length > 0) {
      const q = result.questions[0];

      if (q.minOvers !== null && q.maxOvers !== null) {
        expect(q.minOvers).toBeLessThanOrEqual(q.maxOvers);
      }

      if (q.minNRR !== null && q.maxNRR !== null) {
        expect(q.minNRR).toBeGreaterThanOrEqual(0);
        expect(q.maxNRR).toBeGreaterThanOrEqual(0);
      }

      expect(result.summary.message).toContain(myTeam.name);
    } else {
      throw new Error("Questions array is undefined or empty");
    }
  });

  it("should return 'Not achievable' if desired position is impossible", () => {
    const runsScored = 119; // very high runs, may not reach desired position
    const overs = 20;
    const desiredPosition = 1;

    const result = simulateBowlingScenario(
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

  it("minOvers should be less than or equal to maxOvers", () => {
    const runsScored = 120;
    const overs = 20;
    const desiredPosition = 3;

    const result = simulateBowlingScenario(
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
      if (q.minOvers !== null && q.maxOvers !== null) {
        expect(q.minOvers).toBeLessThanOrEqual(q.maxOvers);
      }
    } else {
      throw new Error("Questions array is undefined or empty");
    }
  });
});
