"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WordSearchGame } from "@/components/word-search-game"
import { Leaderboard } from "@/components/leaderboard"

export default function PlayPage() {
  const router = useRouter()
  const [currentPlayer, setCurrentPlayer] = useState<{ id: string; player_name: string } | null>(null)

  useEffect(() => {
    const playerData = localStorage.getItem("currentPlayer")
    if (!playerData) {
      router.push("/game/enter")
      return
    }
    setCurrentPlayer(JSON.parse(playerData))
  }, [router])

  if (!currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-2 md:p-4">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-4 md:gap-6">
          <div>
            <WordSearchGame player={currentPlayer} />
          </div>
          <div className="lg:sticky lg:top-4 h-fit">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}
