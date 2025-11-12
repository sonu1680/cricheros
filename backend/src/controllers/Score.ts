// import { TeamStats } from "../const/types.js";
// import { ballsToOvers, calculateNRR, sortTeams } from "../utils";

// interface SimulateMatchParams {
//   baseTable: TeamStats[];
//   myTeam: TeamStats;
//   oppTeam: TeamStats;
//   team: string;
//   tossResult: "bat" | "bowl";
//   runsScored: number;
//   overs: number;
//   oppRuns?: number; // required if batting first
//   chaseBalls?: number; // required if chasing
//   target?: number; // required if chasing
// }

// interface SimulateMatchResult {
//   position: number;
//   nrr: number;
// }

// export function simulateMatch({
//   baseTable,
//   myTeam,
//   oppTeam,
//   team,
//   tossResult,
//   runsScored,
//   overs,
//   oppRuns,
//   chaseBalls,
//   target,
// }: SimulateMatchParams): SimulateMatchResult {
//   const newTable: TeamStats[] = baseTable.map((t) => ({ ...t }));
//   const updatedTeam = newTable.find((t) => t.name === myTeam.name);
//   const updatedOpp = newTable.find((t) => t.name === oppTeam.name);

//   if (!updatedTeam || !updatedOpp)
//     throw new Error("Invalid team data passed to simulateMatch");

//   if (tossResult === "bat") {
//     // 🏏 Batting first
//     if (oppRuns === undefined)
//       throw new Error("oppRuns required when batting first");

//     updatedTeam.runsFor += runsScored;
//     updatedTeam.oversFor += overs;
//     updatedTeam.runsAgainst += oppRuns;
//     updatedTeam.oversAgainst += overs;
//     updatedTeam.matches++;
//     if (runsScored > oppRuns) updatedTeam.points += 2;

//     updatedOpp.runsFor += oppRuns;
//     updatedOpp.oversFor += overs;
//     updatedOpp.runsAgainst += runsScored;
//     updatedOpp.oversAgainst += overs;
//     updatedOpp.matches++;
//   } else {
//     // 🏏 Bowling first
//     if (chaseBalls === undefined || target === undefined)
//       throw new Error("chaseBalls and target required when bowling first");

//     const chaseOvers = ballsToOvers(chaseBalls);

//     updatedTeam.runsFor = myTeam.runsFor + target;
//     updatedTeam.oversFor = myTeam.oversFor + chaseOvers;
//     updatedTeam.runsAgainst = myTeam.runsAgainst + runsScored;
//     updatedTeam.oversAgainst = myTeam.oversAgainst + overs;
//     updatedTeam.matches++;
//     updatedTeam.points += 2;

//     updatedOpp.runsFor = oppTeam.runsFor + runsScored;
//     updatedOpp.oversFor = oppTeam.oversFor + overs;
//     updatedOpp.runsAgainst = oppTeam.runsAgainst + target;
//     updatedOpp.oversAgainst = oppTeam.oversAgainst + chaseOvers;
//     updatedOpp.matches++;
//   }

//   // 🧮 Calculate NRR for both
//   updatedTeam.nrr = calculateNRR(updatedTeam);
//   updatedOpp.nrr = calculateNRR(updatedOpp);

//   // 🏆 Determine position
//   const ranked = sortTeams(newTable);
//   const newPosition = ranked.findIndex((t) => t.name === team) + 1;

//   return { position: newPosition, nrr: updatedTeam.nrr };
// }
