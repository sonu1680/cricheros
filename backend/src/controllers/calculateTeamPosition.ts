import { Request, Response } from "express";
import { MatchInput, TeamStats } from "../const/types";
import { POINTS_TABLE } from "../const/pointsTable";
import { simulateBattingScenario } from "../services/simulateBattingScenario";
import { simulateBowlingScenario } from "../services/simulateBowlingScenario";

/**
 * controller to calculate a team's possible position in the points table
 * based on match inputs such as runs scored, overs, toss result, and desired position.
 *
 * @param req Express request object containing match details in req.body:
 *  - team: string (your team name)
 *  - opponent: string (opponent team name)
 *  - tossResult: "bat" | "bowl" (toss decision)
 *  - runsScored: number (runs scored or target)
 *  - overs: number (overs played or remaining)
 *  - desiredPosition: number (position you want to check)
 */
export const calculateTeamPosition = (req: Request, res: Response) => {
  try {
    // extract match input from request body
    const { team, opponent, tossResult }: MatchInput = req.body;
    const runsScored = Number(req.body.runsScored);
    const overs = Number(req.body.overs);
    const desiredPosition = Number(req.body.desiredPosition);

    // find the team and opponent in the points table
    const myTeam = POINTS_TABLE.find((t) => t.name === team);
    const oppTeam = POINTS_TABLE.find((t) => t.name === opponent);

    // return error if either team is invalid
    if (!myTeam || !oppTeam)
      return res.status(400).json({ error: "Invalid team or opponent name" });

    let result;

    // simulate based on toss decision
    switch (tossResult) {
      case "bat":
        result = simulateBattingScenario(
          team,
          opponent,
          myTeam,
          oppTeam,
          runsScored,
          overs,
          desiredPosition
        );
        break;

      case "bowl":
        result = simulateBowlingScenario(
          team,
          opponent,
          myTeam,
          oppTeam,
          runsScored,
          overs,
          desiredPosition
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid toss result" });
    }

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};
