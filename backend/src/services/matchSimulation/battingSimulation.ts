import { POINTS_TABLE } from "../../const/pointsTable";
import { SimulationParams, TeamStats } from "../../const/types";
import { binarySearchRange } from "../../utils/binarySearchUtils";
import { cloneTable, simulateTeamsUpdate } from "../../utils/teamUtils";



export const simulateBattingScenario = ({
  team,
  opponent,
  myTeam,
  oppTeam,
  runsScored,
  overs,
  desiredPosition,
}: SimulationParams) => {
  const baseTable = cloneTable(POINTS_TABLE);

  const simulateMatch = (oppRuns: number) =>
    simulateTeamsUpdate(baseTable, myTeam, oppTeam, team, (t, o) => {
      t.runsFor += runsScored;
      t.oversFor += overs;
      t.runsAgainst += oppRuns;
      t.oversAgainst += overs;
      t.matches++;
      if (runsScored > oppRuns) t.points += 2;

      o.runsFor += oppRuns;
      o.oversFor += overs;
      o.runsAgainst += runsScored;
      o.oversAgainst += overs;
      o.matches++;
    });

  const { minValue, maxValue, minNRR, maxNRR } = binarySearchRange(
    0,
    runsScored + 6,
    simulateMatch,
    desiredPosition
  );

  if (minValue === null)
    return { summary: { message: "Not achievable with given data" } };

  return {
    summary: {
      desiredPosition,
      oppositionTeam: opponent,
      yourTeam: team,
      message: `If ${team} score ${runsScored} runs in ${overs} overs, ${team} need to restrict ${opponent} between ${minValue} to ${maxValue} runs. Revised NRR of ${team}: ${minNRR?.toFixed(
        3
      )} to ${maxNRR?.toFixed(3)}.`,
    },
    questions: [
      {
        label: "Q",
        type: "batting_restrict",
        title: `If ${team} score ${runsScored} runs in ${overs} overs`,
        yourTeam: team,
        oppositionTeam: opponent,
        overs,
        runsScored,
        minRuns: minValue,
        maxRuns: maxValue,
        minNRR,
        maxNRR,
      },
    ],
  };
};
