import { type NextRequest, NextResponse } from "next/server"
import { submitAnswer } from "@/app/actions/quiz-actions"

export async function POST(request: NextRequest) {
  try {
    const { participantId, questionId, answerId, timeTaken } = await request.json()

    const result = await submitAnswer(participantId, questionId, answerId, timeTaken)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error submitting answer:", error)
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 400 })
  }
}
