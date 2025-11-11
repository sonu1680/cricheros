export interface TeamStats {
  name: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  runsFor: number;
  oversFor: number;
  runsAgainst: number;
  oversAgainst: number;
  points: number;
}

export interface MatchInput {
  team: string;
  opponent: string;
  overs: number;
  desiredPosition: number;
  tossResult: "bat" | "bowl";
  runsScored: number;
}
