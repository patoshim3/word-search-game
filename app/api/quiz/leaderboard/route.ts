import { type NextRequest, NextResponse } from "next/server"
import { getQuizLeaderboard } from "@/app/actions/quiz-actions"

export async function GET(request: NextRequest) {
  try {
    const gameCode = request.nextUrl.searchParams.get("gameCode")

    if (!gameCode) {
      return NextResponse.json({ error: "Game code required" }, { status: 400 })
    }

    const leaderboard = await getQuizLeaderboard(gameCode)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("[v0] Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 400 })
  }
}
