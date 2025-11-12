import express from "express";
import { ballsToOvers, calculateNRR, sortTeams } from "../utils/index.js";
import { MatchInput, TeamStats } from "../const/types.js";
import { pointsTable } from "../const/pointsTable.js";

const router = express.Router();

router.post("/calculate", (req, res) => {
  try {
    const { team, opponent, tossResult }: MatchInput = req.body;
    const runsScored = Number(req.body.runsScored);
    const overs = Number(req.body.overs);
    const desiredPosition = Number(req.body.desiredPosition);

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
      function simulateMatch(oppRuns: any) {
        const newTable = baseTable.map((t) => ({ ...t }));
        const updatedTeam = newTable.find((t) => t.name === myTeam?.name)!;
        const updatedOpp = newTable.find((t) => t.name === oppTeam?.name)!;

        // Update stats for both teams
        updatedTeam.runsFor += runsScored;
        updatedTeam.oversFor += overs;
        updatedTeam.runsAgainst += oppRuns;
        updatedTeam.oversAgainst += overs;
        updatedTeam.matches++;
        if (runsScored > oppRuns) updatedTeam.points += 2;

        // Calculate NRR here
        updatedTeam.nrr = calculateNRR(updatedTeam);

        updatedOpp.runsFor += oppRuns;
        updatedOpp.oversFor += overs;
        updatedOpp.runsAgainst += runsScored;
        updatedOpp.oversAgainst += overs;
        updatedOpp.matches++;
        updatedOpp.nrr = calculateNRR(updatedOpp);

        const ranked = sortTeams(newTable);
        const newPosition = ranked.findIndex((t) => t.name === team) + 1;

        // Return both position and NRR 
        return {
          position: newPosition,
          nrr: updatedTeam.nrr,
        };
      }

      let low = 0,
        high = runsScored + 6;
      let minValue = null,
        maxValue = null;
      let minNRR = null,
        maxNRR = null;

      // Find minimum opponent runs
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const { position, nrr } = simulateMatch(mid);

        if (position === desiredPosition) {
          minValue = mid;
          minNRR = nrr;
          high = mid - 1;
        } else if (position > desiredPosition) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      low = 0;
      high = runsScored + 6;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const { position, nrr } = simulateMatch(mid);

        if (position === desiredPosition) {
          maxValue = mid;
          maxNRR = nrr;
          low = mid + 1;
        } else if (position > desiredPosition) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      if (minValue === null) {
        return res.json({
          message: "Not achievable with given data",
        });
      }

      const calucatedResult = {
        label: "Q",
        maxNRR: maxNRR,
        maxRuns: maxValue,
        minNRR: minNRR,
        minRuns: minValue,
        oppositionTeam: opponent,
        overs: overs,
        runsScored: runsScored,
        title: `If ${team} score ${runsScored} runs in ${overs} overs`,
        type: "batting_restrict",
        yourTeam: team,
      };

      const result = {
        summary: {
          desiredPosition: desiredPosition,
          oppositionTeam: opponent,
          yourTeam: team,
          message: `If ${team} score ${runsScored} runs in ${overs} overs, ${team} need to restrict ${opponent} between ${minValue} to ${maxValue} runs in ${overs} overs. Revised NRR of ${team} will be between ${minNRR?.toFixed(
            3
          )} to ${maxNRR?.toFixed(3)}.`,
        },
        questions: [calucatedResult],
      };

      return res.json({
        result: result,
      });
    }

    // ----------------  case 2: Bowling First ----------------
    else {
      const target = runsScored + 1;
      const totalBalls = overs * 6;

      const simulateMatch = (chaseBalls: number) => {
        const chaseOvers = ballsToOvers(chaseBalls);
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

        return { position: newPosition, nrr: updatedTeam.nrr };
      };

      // Binary Search for min overs (fastest chase)
      let low = 0,
        high = totalBalls;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const { position, nrr } = simulateMatch(mid);
        if (position === desiredPosition) {
          minValue = Number((mid / 6).toFixed(2));
          minNRR = nrr;
          high = mid - 1;
        } else if (position > desiredPosition) high = mid - 1;
        else low = mid + 1;
      }

      // Binary Search for max overs (slowest chase)
      low = 0;
      high = totalBalls;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        const { position, nrr } = simulateMatch(mid);

        if (position === desiredPosition) {
          maxValue = Number((mid / 6).toFixed(2));
          maxNRR = nrr;
          low = mid + 1;
        } else if (position > desiredPosition) high = mid - 1;
        else low = mid + 1;
      }
      if (minValue === null) {
        return res.json({
          message: "Not achievable with given data",
        });
      }

      const calucatedResult = {
        label: "Q",
        type: "bowling_chase",
        title: `If ${opponent} scores ${runsScored} runs in ${overs} overs`,
        yourTeam: team,
        oppositionTeam: opponent,
        overs: overs,
        runsToChase: runsScored,
        minOvers: minValue,
        maxOvers: maxValue,
        minNRR: minNRR,
        maxNRR: maxNRR,
      };

      const result = {
        summary: {
          desiredPosition: desiredPosition,
          oppositionTeam: opponent,
          yourTeam: team,
          message: `${team} need to chase ${runsScored} runs between ${minValue} and ${maxValue} overs. Revised NRR of ${team} will be between ${minNRR?.toFixed(
            3
          )} to ${maxNRR?.toFixed(3)}.`,
        },
        questions: [calucatedResult],
      };

      return res.json({
        result: result,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
});

export default router;
