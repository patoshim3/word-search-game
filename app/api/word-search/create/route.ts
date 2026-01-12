import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { title, stage, language, words, timeLimit } = await request.json()
    const supabase = await createServerClient()

    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { error } = await supabase.from("word_search_configs").insert({
      game_code: gameCode,
      title,
      stage,
      language,
      words,
      time_limit: timeLimit,
      is_active: true,
    })

    if (error) throw error

    return NextResponse.json({ gameCode })
  } catch (error) {
    console.error("[v0] Error creating word search:", error)
    return NextResponse.json({ error: "Failed to create game" }, { status: 400 })
  }
}
