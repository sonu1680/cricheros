import { TeamStats } from "../const/types.js";
import { calculateNRR, sortTeams } from "./index.js";

export const cloneTable = (pointsTable: TeamStats[]) =>
  JSON.parse(JSON.stringify(pointsTable)) as TeamStats[];

export const simulateTeamsUpdate = (
  baseTable: TeamStats[],
  myTeam: TeamStats,
  oppTeam: TeamStats,
  team: string,
  updateFn: (updatedTeam: TeamStats, updatedOpp: TeamStats) => void
) => {
  const newTable = baseTable.map((t) => ({ ...t }));
  const updatedTeam = newTable.find((t) => t.name === myTeam.name)!;
  const updatedOpp = newTable.find((t) => t.name === oppTeam.name)!;

  updateFn(updatedTeam, updatedOpp);

  updatedTeam.nrr = calculateNRR(updatedTeam);
  updatedOpp.nrr = calculateNRR(updatedOpp);

  const ranked = sortTeams(newTable);
  const newPosition = ranked.findIndex((t) => t.name === team) + 1;

  return { position: newPosition, nrr: updatedTeam.nrr };
};
