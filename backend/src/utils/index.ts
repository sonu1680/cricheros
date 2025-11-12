import { TeamStats } from "../const/types";

export const normalizeOver = (overs: string | number): number => {
  const [over, balls] = overs.toString().split(".");
  const totalBalls = parseInt(over) * 6 + (balls ? parseInt(balls) : 0);
  return totalBalls / 6;
};
export const ballsToOvers = (balls: number): number => {
  const over = Math.floor(balls / 6);
  const ball = balls % 6;
  return Number(`${over}.${ball}`);
};

export const calculateNRR = (team: TeamStats): number => {
  const forRate = team.runsFor / normalizeOver(team.oversFor);
  const againstRate = team.runsAgainst / normalizeOver(team.oversAgainst);
  return forRate - againstRate;
};

export const sortTeams = (teams: TeamStats[]) =>
  teams.sort((a, b) =>
    b.points === a.points ? b.nrr - a.nrr : b.points - a.points
  );



 
