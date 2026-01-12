import { type NextRequest, NextResponse } from "next/server"
import { getQuizByCode } from "@/app/actions/quiz-actions"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const data = await getQuizByCode(code)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching quiz:", error)
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }
}
