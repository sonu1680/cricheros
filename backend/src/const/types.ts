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
export interface MatchContext {
  myTeam: any;
  oppTeam: any;
  baseTable: any[];
  runsScored: number;
  overs: number;
  oppRuns?: number; // used if batting first
  chaseBalls?: number; // used if chasing
  target?: number; // used if chasing
  battingFirst: boolean;
}
