import express from "express";
import { calculateNRR, sortTeams } from "../utils/index.js";
import { MatchInput, TeamStats } from "../const/types.js";
import { pointsTable } from "../const/pointsTable.js";

const router = express.Router();


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

// ----------------  case 1: Batting First ----------------
if (tossResult === "bat") {
  for (let oppRuns = 0; oppRuns <= runsScored + 6; oppRuns++) {
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
      if (minValue === null || minValue == 0) {
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

// ----------------  case 2: Bowling First ----------------
else {
  const target = runsScored + 1;
  const totalBalls = overs * 6; // total balls in the innings

  // iterate ball by ball instead of approximate overs decrement
  for (let chaseBalls = totalBalls; chaseBalls >= 0; chaseBalls--) {
    const chaseOvers = chaseBalls / 6; // convert balls to fractional overs

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
    updatedOpp.matches++;
    updatedOpp.nrr = calculateNRR(updatedOpp);

    const ranked = sortTeams(newTable);
    const newPosition = ranked.findIndex((t) => t.name === team) + 1;

    if (newPosition === desiredPosition) {
      if (minValue === null|| minValue==0) {
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
    message: `${team} need to chase ${runsScored} runs between ${maxValue} and ${minValue} overs. Revised NRR of ${team} will be between ${minNRR?.toFixed(
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
