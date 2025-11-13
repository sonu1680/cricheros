import { TeamStats } from "../const/types.js";

// Deep clone the points table to avoid mutating the original data
export const cloneTable = (pointsTable: TeamStats[]) =>
  JSON.parse(JSON.stringify(pointsTable)) as TeamStats[];
