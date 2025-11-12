import { type NextRequest, NextResponse } from "next/server"
import { calculateRequirements } from "@/lib/calculator"
import { POINTS_TABLE } from "@/lib/constants"

/**
 * POST /api/calculate
 * Calculates team performance requirements to reach desired position
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const { yourTeam, oppositionTeam, overs, desiredPosition, tossResult, runsOrChase } = body

    if (!yourTeam || !oppositionTeam || !desiredPosition || !runsOrChase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (yourTeam === oppositionTeam) {
      return NextResponse.json({ error: "Your team and opposition team cannot be the same" }, { status: 400 })
    }

    // Calculate requirements
    const results = calculateRequirements({
      yourTeam,
      oppositionTeam,
      overs: Number.parseInt(overs),
      desiredPosition: Number.parseInt(desiredPosition),
      tossResult,
      runsOrChase: Number.parseInt(runsOrChase),
      pointsTable: POINTS_TABLE,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Calculation error:", error)
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
