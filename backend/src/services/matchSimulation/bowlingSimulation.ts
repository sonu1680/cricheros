import { POINTS_TABLE } from "../../const/pointsTable";
import { SimulationParams, TeamStats } from "../../const/types";
import { ballsToOvers } from "../../utils";
import { binarySearchRange } from "../../utils/binarySearchUtils";
import { cloneTable, simulateTeamsUpdate } from "../../utils/teamUtils";



export const simulateBowlingScenario = ({
  team,
  opponent,
  myTeam,
  oppTeam,
  runsScored,
  overs,
  desiredPosition,
}: SimulationParams) => {
  const baseTable = cloneTable(POINTS_TABLE);
  const totalBalls = overs * 6;
  const target = runsScored + 1;

  const simulateMatch = (chaseBalls: number) =>
    simulateTeamsUpdate(baseTable, myTeam, oppTeam, team, (t, o) => {
      const chaseOvers = ballsToOvers(chaseBalls);

      t.runsFor = myTeam.runsFor + target;
      t.oversFor = myTeam.oversFor + chaseOvers;
      t.runsAgainst = myTeam.runsAgainst + runsScored;
      t.oversAgainst = myTeam.oversAgainst + overs;
      t.matches++;
      t.points += 2;

      o.runsFor += runsScored;
      o.oversFor += overs;
      o.runsAgainst += target;
      o.oversAgainst += chaseOvers;
      o.matches++;
    });

  const { minValue, maxValue, minNRR, maxNRR } = binarySearchRange(
    0,
    totalBalls,
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
      message: `${team} need to chase ${runsScored} runs between ${minValue/6} and ${maxValue!/6} overs. Revised NRR: ${minNRR?.toFixed(
        3
      )} to ${maxNRR?.toFixed(3)}.`,
    },
    questions: [
      {
        label: "Q",
        type: "bowling_chase",
        title: `If ${opponent} scores ${runsScored} runs in ${overs} overs`,
        yourTeam: team,
        oppositionTeam: opponent,
        overs,
        runsToChase: runsScored,
        minOvers: minValue,
        maxOvers: maxValue,
        minNRR,
        maxNRR,
      },
    ],
  };
};
