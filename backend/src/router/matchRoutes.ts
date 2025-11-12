import express from "express";
import { calculateNRR } from "../utils/nrrCalculator.js";
import { MatchInput, TeamStats } from "../const/types.js";
import { pointsTable } from "../const/pointsTable.js";

const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({ message: "API is working" });
});

/** Helper to sort points table by points then NRR */
const sortTeams = (teams: TeamStats[]) =>
  teams.sort((a, b) =>
    b.points === a.points ? b.nrr - a.nrr : b.points - a.points
  );

// router.post("/calculate", (req, res) => {
//   try {
//     const {
//       team,
//       opponent,
//       overs,
//       tossResult,
//       runsScored,
//       desiredPosition,
//     }: MatchInput = req.body;

//     const myTeam = pointsTable.find((t) => t.name === team);
//     const oppTeam = pointsTable.find((t) => t.name === opponent);

//     if (!myTeam || !oppTeam)
//       return res.status(400).json({ error: "Invalid team or opponent name" });

//     // Clone table to avoid mutation
//     const baseTable = JSON.parse(JSON.stringify(pointsTable)) as TeamStats[];

//     let minValue: number | null = null;
//     let maxValue: number | null = null;

//     //  Case 1 — Batting first
//     if (tossResult === "bat") {
//       for (
//         let oppRuns = runsScored - 100;
//         oppRuns <= runsScored + 100;
//         oppRuns++
//       ) {
//         console.log(overs);
//         const newTable = baseTable.map((t) => ({ ...t }));
//         const updatedTeam = newTable.find((t) => t.name === myTeam.name)!;
//         const updatedOpp = newTable.find((t) => t.name === oppTeam.name)!;
//         updatedTeam.runsFor += runsScored;
//         updatedTeam.oversFor += overs;
//         updatedTeam.runsAgainst += oppRuns;
//         updatedTeam.oversAgainst += overs;
//         updatedTeam.matches++;
//         updatedTeam.nrr = calculateNRR(updatedTeam);

//         // Opponent update
//         updatedOpp.runsFor += oppRuns;
//         updatedOpp.oversFor += overs;
//         updatedOpp.runsAgainst += runsScored;
//         updatedOpp.oversAgainst += overs;
//         updatedOpp.matches++;
//         updatedOpp.nrr = calculateNRR(updatedOpp);

//         // Winner gets points
//         if (runsScored > oppRuns) updatedTeam.points += 2;
//         else updatedOpp.points += 2;

//         const ranked = sortTeams(newTable);
//         const newPosition = ranked.findIndex((t) => t.name === team) + 1;

//         if (newPosition === desiredPosition) {
//           if (minValue === null) minValue = oppRuns;
//           maxValue = oppRuns;
//         }
//       }

//       return res.json({
//         case: "bat",
//         team,
//         opponent,
//         range: minValue
//           ? { restrictBetween: `${minValue} - ${maxValue} runs` }
//           : "Not achievable with given data",
//       });
//     }

//     //  Case 2 — Bowling first
//     else {
//       const target = runsScored + 1; // because you must chase one run more to win
//       for (let chaseOvers = overs; chaseOvers >= 5; chaseOvers -= 0.05) {
//         const newTable = baseTable.map((t) => ({ ...t }));

//         const updatedTeam = newTable.find((t) => t.name === myTeam.name)!;
//         const updatedOpp = newTable.find((t) => t.name === oppTeam.name)!;

//         // Opponent innings
//         updatedOpp.runsFor += runsScored;
//         updatedOpp.oversFor += overs;
//         updatedOpp.runsAgainst += target;
//         updatedOpp.oversAgainst += chaseOvers;
//         updatedOpp.matches++;
//         updatedOpp.nrr = calculateNRR(updatedOpp);

//         // Your team innings
//         updatedTeam.runsFor += target;
// updatedTeam.oversFor = ballsToOvers(
//   oversToBalls(updatedTeam.oversFor) + oversToBalls(chaseOvers)
// );
//         updatedTeam.runsAgainst += runsScored;
//         updatedTeam.oversAgainst += overs;
//         updatedTeam.matches++;
//         updatedTeam.points += 2; // winner
//         updatedTeam.nrr = calculateNRR(updatedTeam);

//         const ranked = sortTeams(newTable);
//         const newPosition = ranked.findIndex((t) => t.name === team) + 1;

//         if (newPosition === desiredPosition) {
//           if (minValue === null) minValue = Number(chaseOvers.toFixed(2));
//           maxValue = Number(chaseOvers.toFixed(2));
//         }
//       }

//       return res.json({
//         case: "bowl",
//         team,
//         opponent,
//         range: minValue
//           ? { chaseBetween: `${maxValue} - ${minValue} overs` }
//           : "Not achievable with given data",
//       });
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong", details: err });
//   }
// });

router.post("/calculate", (req, res) => {
  try {
    const {
      team,
      opponent,
      overs,
      tossResult,
      runsScored,
      desiredPosition,
    }: MatchInput = req.body;

    const myTeam = pointsTable.find((t) => t.name === team);
    const oppTeam = pointsTable.find((t) => t.name === opponent);

    if (!myTeam || !oppTeam)
      return res.status(400).json({ error: "Invalid team or opponent name" });

    const baseTable = JSON.parse(JSON.stringify(pointsTable)) as TeamStats[];
    let minValue: number | null = null;
    let maxValue: number | null = null;
    let minNRR: number | null = null;
    let maxNRR: number | null = null;

    // ----------------  Case 1: Batting First ----------------
    if (tossResult === "bat") {
      for (let oppRuns = 0; oppRuns <= runsScored + 10; oppRuns++) {
        const newTable = baseTable.map((t) => ({ ...t }));
        const updatedTeam = newTable.find((t) => t.name === myTeam.name)!;
        const updatedOpp = newTable.find((t) => t.name === oppTeam.name)!;

        updatedTeam.runsFor += runsScored;
        updatedTeam.oversFor += overs;
        updatedTeam.runsAgainst += oppRuns;
        updatedTeam.oversAgainst += overs;
        updatedTeam.matches++;
        if (runsScored > oppRuns) updatedTeam.points += 2;
        updatedTeam.nrr = calculateNRR(updatedTeam);

        updatedOpp.runsFor += oppRuns;
        updatedOpp.oversFor += overs;
        updatedOpp.runsAgainst += runsScored;
        updatedOpp.oversAgainst += overs;
        updatedOpp.matches++;
        updatedOpp.nrr = calculateNRR(updatedOpp);

        const ranked = sortTeams(newTable);
        const newPosition = ranked.findIndex((t) => t.name === team) + 1;

        if (newPosition === desiredPosition) {
          if (minValue === null) {
            minValue = oppRuns;
            minNRR = updatedTeam.nrr;
          }
          maxValue = oppRuns;
          maxNRR = updatedTeam.nrr;
        }
      }

      if (!minValue)
        return res.json({
          message: "Not achievable with given data",
        });

      return res.json({
        message: `If ${team} score ${runsScored} runs in ${overs} overs, ${team} need to restrict ${opponent} between ${minValue} to ${maxValue} runs in ${overs} overs. Revised NRR of ${team} will be between ${minNRR?.toFixed(
          3
        )} to ${maxNRR?.toFixed(3)}.`,
      });
    }

    // ----------------  Case 2: Bowling First ----------------
    else {
      const target = runsScored + 1;
      for (let chaseOvers = overs; chaseOvers >= 1; chaseOvers -= 0.166) {
        const newTable = baseTable.map((t) => ({ ...t }));
        const updatedTeam = newTable.find((t) => t.name === myTeam.name)!;
        const updatedOpp = newTable.find((t) => t.name === oppTeam.name)!;
        updatedTeam.runsFor = myTeam.runsFor + target;
        updatedTeam.oversFor = myTeam.oversFor + chaseOvers;
        updatedTeam.runsAgainst = myTeam.runsAgainst + runsScored;
        updatedTeam.oversAgainst = myTeam.oversAgainst + overs;

        updatedTeam.matches++;
        updatedTeam.points += 2;
        updatedTeam.nrr = calculateNRR(updatedTeam);

        updatedOpp.runsFor = oppTeam.runsFor + runsScored;
        updatedOpp.oversFor = oppTeam.oversFor + overs;
        updatedOpp.runsAgainst = oppTeam.runsAgainst + target;
        updatedOpp.oversAgainst = oppTeam.oversAgainst + chaseOvers;
        console.log(
          chaseOvers,
          "myNrr:",
          updatedTeam.nrr,
          "oppNrr:",
          updatedOpp.nrr
        );
        updatedOpp.matches++;
        updatedOpp.nrr = calculateNRR(updatedOpp);

        const ranked = sortTeams(newTable);
        const newPosition = ranked.findIndex((t) => t.name === team) + 1;

        if (newPosition === desiredPosition) {
          if (minValue === null) {
            minValue = Number(chaseOvers.toFixed(2));
            minNRR = updatedTeam.nrr;
          }
          maxValue = Number(chaseOvers.toFixed(2));
          maxNRR = updatedTeam.nrr;
        }
      }

      if (!minValue)
        return res.json({
          message: "Not achievable with given data",
        });

      return res.json({
        message: `${team} need to chase ${runsScored} runs between ${maxValue} and ${minValue} overs.Revised NRR of ${team} will be between ${minNRR?.toFixed(
          3
        )} to ${maxNRR?.toFixed(3)}.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
});

export default router;
