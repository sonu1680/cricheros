import { POINTS_TABLE } from "../const/pointsTable";
import { TeamStats } from "../const/types";
import { ballsToOvers, calculateNRR, normalizeOver, oversToBalls, sortTeams } from "../utils";
import { cloneTable } from "../utils/teamUtils";

/**
 * Simulates a bowling scenario for a team to reach a desired position
 * in the points table by chasing a target within a certain range of overs.
 *
 * @param team - Name of the team that is chasing
 * @param opponent - Name of the opposing team
 * @param myTeam - Stats of the team that is chasing
 * @param oppTeam - Stats of the opposition team
 * @param runsScored - Runs scored by the opposition
 * @param overs - Overs faced by the opposition
 * @param desiredPosition - The points table position the team wants to achieve
 * @returns Object containing summary and question info for the scenario
 */
export const simulateBowlingScenario = (
  team: string,
  opponent: string,
  myTeam: TeamStats,
  oppTeam: TeamStats,
  runsScored: number,
  overs: number,
  desiredPosition: number
) => {
  // deep clone the points table so original stats are not mutated
  const baseTable = cloneTable(POINTS_TABLE);

  // target score to chase is 1 more than opponent's runs
  const target = runsScored + 1;
  const totalBalls = overs * 6; // convert overs to balls for precise calculation

  /**
   * simulate a match given number of balls used for chasing
   * @param chaseBalls - Number of balls taken to chase the target
   * @returns New position of myTeam and updated NRR
   */
  const simulateMatch = (chaseBalls: number) => {
    const chaseOvers = ballsToOvers(chaseBalls); // Convert balls to overs
    const tableClone = baseTable.map((t) => ({ ...t })); // Clone for safe mutation
    const updatedTeam = tableClone.find((t) => t.name === myTeam.name)!;
    const updatedOpp = tableClone.find((t) => t.name === oppTeam.name)!;
    //update chasing team stats
    updatedTeam.runsFor = myTeam.runsFor + target;
    updatedTeam.oversFor = ballsToOvers(
      oversToBalls(myTeam.oversFor) + chaseBalls
    );;
  
    updatedTeam.runsAgainst = myTeam.runsAgainst + runsScored;
    updatedTeam.oversAgainst = myTeam.oversAgainst + overs;
    updatedTeam.matches++;
    updatedTeam.points += 2; // winning adds 2 points
    updatedTeam.nrr = calculateNRR(updatedTeam);

    // update opposition stats
    updatedOpp.runsFor = oppTeam.runsFor + runsScored;
    updatedOpp.oversFor = oppTeam.oversFor + overs;
    updatedOpp.runsAgainst = oppTeam.runsAgainst + target;
    updatedOpp.oversAgainst = ballsToOvers(
      oversToBalls(oppTeam.oversAgainst) + chaseBalls
    );;
 
    updatedOpp.matches++;
    updatedOpp.nrr = calculateNRR(updatedOpp);
   

    // sort teams by points and NRR to find new ranking
    const ranked = sortTeams(tableClone);

    const newPosition = ranked.findIndex((t) => t.name === myTeam.name) + 1;

    return { position: newPosition, nrr: updatedTeam.nrr };
  };

  // initialize min/max values
  let minValue: number | null = null; // Minimum overs required to achieve desired position
  let maxValue: number | null = null; // Maximum overs allowed
  let minNRR: number | null = null; // NRR for min overs
  let maxNRR: number | null = null; // NRR for max overs

  // Find minimum overs (lower bound)
  let low = 1,
    high = totalBalls;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { position, nrr } = simulateMatch(mid);
    if (position== desiredPosition) {
      minValue = ballsToOvers(mid);
      minNRR = nrr;

      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // Find maximum overs (upper bound)
  low = 1;
   high = totalBalls;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { position, nrr } = simulateMatch(mid);

    if (position <= desiredPosition) {
      
      // We can achieve the position, try slower chases
      maxValue = ballsToOvers(mid);
      maxNRR = nrr;
      low = mid + 1;
    }
     else {
      high = mid - 1;
    }
  }

  // if desired position cannot be achieved
  if (minValue === null)
    return { summary: { message: "Not achievable with given data" } };

  // Return summary and detailed question info
  return {
    summary: {
      desiredPosition,
      oppositionTeam: opponent,
      yourTeam: team,
      message: `${team} need to chase ${runsScored} runs between ${minValue} and ${maxValue} overs. Revised NRR of ${team} will be between ${minNRR?.toFixed(
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
