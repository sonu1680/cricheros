import { TeamStats } from "../const/types";

export const normalizeOver = (overs: string | number): number => {
  const str = overs.toString();
  if (!str.includes(".")) return Number(str);
  const [over, balls] = str.split(".");
  const o = parseInt(over);
  const b = parseInt(balls);
  return o + b / 6;
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



 
