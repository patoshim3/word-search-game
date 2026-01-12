"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Zap, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Confetti from "react-confetti"

type LeaderboardEntry = {
  player_name: string
  score: number
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      const supabase = createClient()
      const playerData = localStorage.getItem("currentPlayer")

      if (!playerData) return

      const player = JSON.parse(playerData)

      const { data, error } = await supabase
        .from("game_sessions")
        .select(`
          score,
          players!inner (
            player_name
          )
        `)
        .not("completed_at", "is", null)
        .order("score", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching results:", error)
        return
      }

      const formatted = data.map((entry: any) => ({
        player_name: entry.players.player_name,
        score: entry.score,
      }))

      setTopPlayers(formatted.slice(0, 5))

      const rank = formatted.findIndex((e: any) => e.player_name === player.player_name)
      setPlayerRank(rank !== -1 ? rank + 1 : null)
    }

    fetchResults()

    setTimeout(() => setShowConfetti(false), 5000)
  }, [])

  const handleGoHome = () => {
    localStorage.removeItem("currentPlayer")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-4">
      {showConfetti && playerRank && playerRank <= 3 && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
      )}

      <div className="max-w-2xl w-full space-y-6">
        <Card className="border-4 border-yellow-300 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-t-xl">
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20 text-yellow-300 animate-bounce" />
            </div>
            <CardTitle className="text-4xl font-bold">Игра завершена!</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">Ваш результат:</p>
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-10 h-10 text-purple-600" />
                <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {score}
                </span>
                <Star className="w-10 h-10 text-yellow-500" />
              </div>
              <p className="text-2xl font-semibold text-purple-600">баллов</p>

              {playerRank && (
                <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                  <p className="text-lg font-semibold text-purple-800">
                    Ваше место: <span className="text-2xl">{playerRank}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="border-t-2 border-purple-200 pt-6">
              <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Топ 5 игроков
              </h3>
              <div className="space-y-3">
                {topPlayers.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300"
                          : index === 2
                            ? "bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300"
                            : "bg-purple-50 border-2 border-purple-200"
                    }`}
                  >
                    <div className="w-8 text-center font-bold text-xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{entry.player_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-700">{entry.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleGoHome}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold px-8 py-6 text-lg shadow-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsContent />
    </Suspense>
  )
}
