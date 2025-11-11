import { TeamStats } from "../const/types";

export const oversToBalls = (overs: number): number => {
  const [whole, fraction] = overs.toString().split(".").map(Number);
  const balls = Math.round((fraction || 0) * 10); // .1 → 1 ball, .2 → 2 balls
  return whole * 6 + (balls > 5 ? 5 : balls);
};

export const ballsToOvers = (balls: number): number => {
  const over = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return parseFloat(`${over}.${remainingBalls}`);
};

export const calculateNRR = (team: TeamStats): number => {
  //console.log(team)
  const forRate = team.runsFor / oversToBalls(team.oversFor);
  const againstRate = team.runsAgainst / oversToBalls(team.oversAgainst);
  return (forRate - againstRate) * 6;
};

export const simulateMatch = (
  team: TeamStats,
  opponent: TeamStats,
  teamRuns: number,
  teamOvers: number,
  opponentRuns: number,
  opponentOvers: number
) => {
  const updatedTeam: TeamStats = {
    ...team,
    matches: team.matches + 1,
    runsFor: team.runsFor + teamRuns,
    oversFor: team.oversFor + teamOvers,
    runsAgainst: team.runsAgainst + opponentRuns,
    oversAgainst: team.oversAgainst + opponentOvers,
  };

  const newNRR = calculateNRR(updatedTeam);
  return newNRR;
};
