import { type NextRequest, NextResponse } from "next/server"
import { joinQuiz } from "@/app/actions/quiz-actions"

export async function POST(request: NextRequest) {
  try {
    const { gameCode, playerName } = await request.json()

    const participant = await joinQuiz(gameCode, playerName)

    return NextResponse.json({ participantId: participant.id })
  } catch (error) {
    console.error("[v0] Error joining quiz:", error)
    return NextResponse.json({ error: "Failed to join quiz" }, { status: 400 })
  }
}
