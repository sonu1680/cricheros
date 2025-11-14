import { TeamStats } from "../const/types";

// converts overs from overs.balls format or number to decimal overs
export const normalizeOver = (overs: string | number): number => {
  const [over, balls] = overs.toString().split(".");
  const totalBalls = parseInt(over) * 6 + (balls ? parseInt(balls) : 0);
  return totalBalls / 6;
};

// converts total balls into overs in overs.balls format
export const ballsToOvers = (balls: number): number => {
  const over = Math.floor(balls / 6);
  const ball = balls % 6;
  return Number(`${over}.${ball}`);
};


// converts total over into balls

export const oversToBalls = (overs: number): number => {
  const [over, balls] = overs.toString().split(".");
  const o = parseInt(over);
  const b = balls ? parseInt(balls) : 0;
  return o * 6 + b;
};


// calculates Net Run Rate  for a team
export const calculateNRR = (team: TeamStats): number => {
  const forRate = team.runsFor / normalizeOver(team.oversFor);
  const againstRate = team.runsAgainst / normalizeOver(team.oversAgainst);
  return forRate - againstRate;
};

// Sorts teams by points and NRR (descending)
export const sortTeams = (teams: TeamStats[]) =>
  teams.sort((a, b) =>
    b.points === a.points ? b.nrr - a.nrr : b.points - a.points
  );
