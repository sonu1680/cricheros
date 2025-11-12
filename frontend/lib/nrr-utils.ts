/**
 * Calculate Net Run Rate (NRR)
 * NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
 */
export function calculateNRR(
  matchData: {
    runsFor: number
    oversFor: number
    runsAgainst: number
    oversAgainst: number
    previousNRR: number
    previousMatches: number
  },
  totalMatches: number,
): number {
  const { runsFor, oversFor, runsAgainst, oversAgainst, previousNRR, previousMatches } = matchData

  // Calculate current match NRR
  const runRateFor = runsFor / oversFor
  const runRateAgainst = runsAgainst / oversAgainst
  const currentMatchNRR = runRateFor - runRateAgainst

  // Calculate cumulative NRR
  const totalPreviousRunsFor = previousNRR * previousMatches * 20 // Assuming 20 overs per match
  const totalPreviousRunsAgainst = previousMatches * 20 - totalPreviousRunsFor / previousNRR

  const cumulativeRunsFor = totalPreviousRunsFor + runsFor
  const cumulativeRunsAgainst = totalPreviousRunsAgainst + runsAgainst
  const cumulativeOvers = totalMatches * oversFor

  const nrr = (cumulativeRunsFor - cumulativeRunsAgainst) / cumulativeOvers

  return nrr
}

/**
 * Calculate run rate given runs and overs
 */
export function calculateRunRate(runs: number, overs: number): number {
  return runs / overs
}
