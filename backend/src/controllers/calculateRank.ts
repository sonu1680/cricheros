import { Request, Response } from "express";
import { MatchInput } from "../const/types";
import { POINTS_TABLE } from "../const/pointsTable";
import { simulateBattingScenario } from "../services/matchSimulation/battingSimulation";
import { simulateBowlingScenario } from "../services/matchSimulation/bowlingSimulation";

export const calculateRank = (req: Request, res: Response) => {
  try {
    const { team, opponent, tossResult }: MatchInput = req.body;
    const runsScored = Number(req.body.runsScored);
    const overs = Number(req.body.overs);
    const desiredPosition = Number(req.body.desiredPosition);

    const myTeam = POINTS_TABLE.find((t) => t.name === team);
    const oppTeam = POINTS_TABLE.find((t) => t.name === opponent);

    if (!myTeam || !oppTeam) {
      return res.status(400).json({ error: "Invalid team or opponent name" });
    }

    let result;


switch (tossResult) {
  case "bat":
    result = simulateBattingScenario({
      team,
      opponent,
      myTeam,
      oppTeam,
      runsScored,
      overs,
      desiredPosition,
    });
    break;

  case "bowl":
    result = simulateBowlingScenario({
      team,
      opponent,
      myTeam,
      oppTeam,
      runsScored,
      overs,
      desiredPosition,
    });
    break;

  default:
    return res
      .status(404)
      .json({message:"Invalid tossResult value. Expected 'bat' or 'bowl'."});
}


    return res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};
