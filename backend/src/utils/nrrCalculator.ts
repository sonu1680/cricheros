import { TeamStats } from "../const/types";

export const oversToBalls = (overs: string | number): number => {
  const [over, balls] = overs.toString().split(".");
  const totalBalls = parseInt(over) * 6 + (balls ? parseInt(balls) : 0);
  return totalBalls / 6;
};

export const ballsToOvers = (balls: number): number => {
  const over = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return parseFloat(`${over}.${remainingBalls}`);
};

export const calculateNRR = (team: TeamStats): number => {
  const forRate = team.runsFor / oversToBalls(team.oversFor);
  const againstRate = team.runsAgainst / oversToBalls(team.oversAgainst);
  return forRate - againstRate;
};
