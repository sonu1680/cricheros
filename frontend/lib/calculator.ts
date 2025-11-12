import { calculateNRR } from "./nrr-utils"

interface CalculationInput {
  yourTeam: string
  oppositionTeam: string
  overs: number
  desiredPosition: number
  tossResult: "batting" | "bowling"
  runsOrChase: number
  pointsTable: any[]
}

interface QuestionResult {
  label: string
  title: string
  type: string
  [key: string]: any
}

/**
 * Main calculator function - processes user input and generates requirement calculations
 * Uses binary search to find min/max bounds for NRR calculations
 */
export function calculateRequirements(input: CalculationInput) {
  const { yourTeam, oppositionTeam, overs, desiredPosition, tossResult, runsOrChase, pointsTable } = input

  const questions: QuestionResult[] = []
  const yourTeamData = pointsTable.find((t) => t.team === yourTeam)
  const oppositionTeamData = pointsTable.find((t) => t.team === oppositionTeam)

  if (!yourTeamData || !oppositionTeamData) {
    throw new Error("Invalid team name")
  }

  if (tossResult === "batting") {
    // Case 1: Your team bats first and scores X runs in Y overs
    // Calculate range of runs to restrict opposition
    const batchResult = calculateBattingFirstScenario({
      yourTeamData,
      oppositionTeamData,
      runsScored: runsOrChase,
      overs,
      desiredPosition,
      pointsTable,
    })
    questions.push(...batchResult)
  } else {
    // Case 2: Opposition bats first
    // Calculate range of overs to chase
    const bowlingResult = calculateBowlingFirstScenario({
      yourTeamData,
      oppositionTeamData,
      runsToChase: runsOrChase,
      overs,
      desiredPosition,
      pointsTable,
    })
    questions.push(...bowlingResult)
  }

  return {
    questions,
    summary: {
      yourTeam,
      oppositionTeam,
      desiredPosition,
    },
  }
}

/**
 * Calculate scenario when your team bats first
 * Find min/max runs to restrict to stay in desired position
 */
function calculateBattingFirstScenario({
  yourTeamData,
  oppositionTeamData,
  runsScored,
  overs,
  desiredPosition,
  pointsTable,
}): QuestionResult[] {
  const yourTeamName = yourTeamData.team
  const oppositionTeamName = oppositionTeamData.team
  const questions: QuestionResult[] = []

  // Calculate current position after this match
  const currentRuns = runsScored
  const newMatches = yourTeamData.matches + 1
  const newWins = yourTeamData.won + 1 // Assuming win for calculation
  const newPoints = yourTeamData.points + 2 // Win = 2 points

  // Binary search for min/max runs to restrict
  let minRestrict = 0
  let maxRestrict = 300

  // Find minimum runs to restrict to stay in desired position
  while (minRestrict < maxRestrict - 1) {
    const mid = Math.floor((minRestrict + maxRestrict) / 2)
    const nrr = calculateNRR(
      {
        runsFor: currentRuns,
        oversFor: overs,
        runsAgainst: mid,
        oversAgainst: overs,
        previousNRR: yourTeamData.nrr,
        previousMatches: yourTeamData.matches,
      },
      newMatches,
    )

    const finalNRR = Number.parseFloat(nrr.toFixed(3))
    const wouldReachPosition = checkIfReachesPosition(finalNRR, newPoints, pointsTable, desiredPosition)

    if (wouldReachPosition) {
      maxRestrict = mid
    } else {
      minRestrict = mid
    }
  }

  // Find maximum runs to restrict
  minRestrict = 0
  maxRestrict = 300
  let maxRunsRestrict = 150

  while (minRestrict < maxRestrict - 1) {
    const mid = Math.floor((minRestrict + maxRestrict) / 2)
    const nrr = calculateNRR(
      {
        runsFor: currentRuns,
        oversFor: overs,
        runsAgainst: mid,
        oversAgainst: overs,
        previousNRR: yourTeamData.nrr,
        previousMatches: yourTeamData.matches,
      },
      newMatches,
    )

    const finalNRR = Number.parseFloat(nrr.toFixed(3))
    const wouldReachPosition = checkIfReachesPosition(finalNRR, newPoints, pointsTable, desiredPosition)

    if (wouldReachPosition) {
      minRestrict = mid
      maxRunsRestrict = mid
    } else {
      maxRestrict = mid
    }
  }

  const minNRR = calculateNRR(
    {
      runsFor: currentRuns,
      oversFor: overs,
      runsAgainst: minRestrict,
      oversAgainst: overs,
      previousNRR: yourTeamData.nrr,
      previousMatches: yourTeamData.matches,
    },
    newMatches,
  )

  const maxNRR = calculateNRR(
    {
      runsFor: currentRuns,
      oversFor: overs,
      runsAgainst: maxRunsRestrict,
      oversAgainst: overs,
      previousNRR: yourTeamData.nrr,
      previousMatches: yourTeamData.matches,
    },
    newMatches,
  )

  questions.push({
    label: "Q1a",
    title: `If ${yourTeamName} scores ${runsScored} runs in ${overs} overs`,
    type: "batting_restrict",
    yourTeam: yourTeamName,
    oppositionTeam: oppositionTeamName,
    runsScored,
    overs,
    minRuns: Math.max(0, minRestrict),
    maxRuns: maxRunsRestrict,
    minNRR: Number.parseFloat(minNRR.toFixed(3)),
    maxNRR: Number.parseFloat(maxNRR.toFixed(3)),
  })

  return questions
}

/**
 * Calculate scenario when opposition bats first
 * Find min/max overs to chase to achieve desired NRR position
 */
function calculateBowlingFirstScenario({
  yourTeamData,
  oppositionTeamData,
  runsToChase,
  overs,
  desiredPosition,
  pointsTable,
}): QuestionResult[] {
  const yourTeamName = yourTeamData.team
  const oppositionTeamName = oppositionTeamData.team
  const questions: QuestionResult[] = []

  // Calculate win scenario: your team chases successfully
  const newMatches = yourTeamData.matches + 1
  const newWins = yourTeamData.won + 1
  const newPoints = yourTeamData.points + 2

  let minOvers = 0.1
  let maxOvers = overs

  // Find minimum overs to chase in
  while (maxOvers - minOvers > 0.1) {
    const mid = (minOvers + maxOvers) / 2
    const nrr = calculateNRR(
      {
        runsFor: runsToChase,
        oversFor: mid,
        runsAgainst: runsToChase,
        oversAgainst: overs,
        previousNRR: yourTeamData.nrr,
        previousMatches: yourTeamData.matches,
      },
      newMatches,
    )

    const finalNRR = Number.parseFloat(nrr.toFixed(3))
    const wouldReachPosition = checkIfReachesPosition(finalNRR, newPoints, pointsTable, desiredPosition)

    if (wouldReachPosition) {
      minOvers = mid
    } else {
      maxOvers = mid
    }
  }

  const minOversRequired = Math.ceil(minOvers * 10) / 10
  const maxOversAllowed = Math.floor(overs * 10) / 10

  const minNRR = calculateNRR(
    {
      runsFor: runsToChase,
      oversFor: minOversRequired,
      runsAgainst: runsToChase,
      oversAgainst: overs,
      previousNRR: yourTeamData.nrr,
      previousMatches: yourTeamData.matches,
    },
    newMatches,
  )

  const maxNRR = calculateNRR(
    {
      runsFor: runsToChase,
      oversFor: maxOversAllowed,
      runsAgainst: runsToChase,
      oversAgainst: overs,
      previousNRR: yourTeamData.nrr,
      previousMatches: yourTeamData.matches,
    },
    newMatches,
  )

  questions.push({
    label: "Q1b",
    title: `If ${oppositionTeamName} scores ${runsToChase} runs in ${overs} overs`,
    type: "bowling_chase",
    yourTeam: yourTeamName,
    oppositionTeam: oppositionTeamName,
    runsToChase,
    overs,
    minOvers: minOversRequired,
    maxOvers: maxOversAllowed,
    minNRR: Number.parseFloat(minNRR.toFixed(3)),
    maxNRR: Number.parseFloat(maxNRR.toFixed(3)),
  })

  return questions
}

/**
 * Check if a team with given NRR and points would reach desired position
 */
function checkIfReachesPosition(nrr: number, points: number, pointsTable: any[], desiredPosition: number): boolean {
  // Count how many teams would have higher/equal points and higher NRR
  let positionCount = 1

  for (const team of pointsTable) {
    if (points < team.points) {
      positionCount++
    } else if (points === team.points && nrr < team.nrr) {
      positionCount++
    }
  }

  return positionCount <= desiredPosition
}
