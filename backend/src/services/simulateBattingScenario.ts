import { POINTS_TABLE } from "../const/pointsTable";
import { TeamStats } from "../const/types";
import { calculateNRR, sortTeams } from "../utils";
import { cloneTable } from "../utils/teamUtils";


/**
 * Simulates a batting scenario for a team to determine the range of opponent runs
 * that will allow the team to achieve a desired position in the points table.
 *
 * @param team - Name of the team batting
 * @param opponent - Name of the opposition team
 * @param myTeam - TeamStats object for the batting team
 * @param oppTeam - TeamStats object for the opposition team
 * @param runsScored - Runs scored by the batting team
 * @param overs - Overs played by the batting team
 * @param desiredPosition - Desired rank/position in points table
 * @returns Object containing summary of the scenario and detailed questions
 */

export const simulateBattingScenario = (
  team: string,
  opponent: string,
  myTeam: TeamStats,
  oppTeam: TeamStats,
  runsScored: number,
  overs: number,
  desiredPosition: number
) => {
  // deep clone the points table
  const baseTable = cloneTable(POINTS_TABLE);

  // simulate match for a given opponent score
  const simulateMatch = (oppRuns: number) => {
    const tableClone = baseTable.map((t) => ({ ...t }));
    const updatedTeam = tableClone.find((t) => t.name === myTeam.name)!;
    const updatedOpp = tableClone.find((t) => t.name === oppTeam.name)!;

    // update batting team stats
    updatedTeam.runsFor += runsScored;
    updatedTeam.oversFor += overs;
    updatedTeam.runsAgainst += oppRuns;
    updatedTeam.oversAgainst += overs;
    updatedTeam.matches++;
    if (runsScored > oppRuns) updatedTeam.points += 2;
    updatedTeam.nrr = calculateNRR(updatedTeam);

    // update opposition team stats
    updatedOpp.runsFor += oppRuns;
    updatedOpp.oversFor += overs;
    updatedOpp.runsAgainst += runsScored;
    updatedOpp.oversAgainst += overs;
    updatedOpp.matches++;
    updatedOpp.nrr = calculateNRR(updatedOpp);

    // rank teams after this match
    const ranked = sortTeams(tableClone);
    const newPosition = ranked.findIndex((t) => t.name === team) + 1;

    return { position: newPosition, nrr: updatedTeam.nrr };
  };

  // initialize min/max values
  let minValue: number | null = null;
  let maxValue: number | null = null;
  let minNRR: number | null = null;
  let maxNRR: number | null = null;

  let low = 0,
    high = runsScored + 6;

  // binary search to find minimum opponent runs for desired position
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { position, nrr } = simulateMatch(mid);
    if (position === desiredPosition) {
      minValue = mid;
      minNRR = nrr;
      high = mid - 1;
    } else if (position > desiredPosition) high = mid - 1;
    else low = mid + 1;
  }

  // binary search to find maximum opponent runs for desired position
  low = 0;
  high = runsScored + 6;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { position, nrr } = simulateMatch(mid);
    if (position === desiredPosition) {
      maxValue = mid;
      maxNRR = nrr;
      low = mid + 1;
    } else if (position > desiredPosition) high = mid - 1;
    else low = mid + 1;
  }

  // If no valid range found
  if (minValue === null)
    return { summary: { message: "Not achievable with given data" } };

  // Return summary and detailed question
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
