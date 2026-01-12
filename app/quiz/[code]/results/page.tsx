"use client"

import { useEffect, useState, use } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

type LeaderboardEntry = {
  player_name: string
  total_score: number
  completed: boolean
}

export default function QuizResultsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const searchParams = useSearchParams()
  const participantId = searchParams.get("participantId")

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [playerRank, setPlayerRank] = useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/quiz/leaderboard?gameCode=${code}`)
      const data = await response.json()
      setLeaderboard(data)

      if (participantId) {
        const playerResponse = await fetch(`/api/quiz/participant/${participantId}`)
        const playerData = await playerResponse.json()
        setPlayerScore(playerData.total_score)

        const rank = data.findIndex((entry: LeaderboardEntry) => entry.player_name === playerData.player_name) + 1
        setPlayerRank(rank)

        if (rank === 1) {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.4 },
          })
        }
      }
    }

    fetchResults()
    const interval = setInterval(fetchResults, 3000)
    return () => clearInterval(interval)
  }, [code, participantId])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-slate-400" />
      case 3:
        return <Award className="w-8 h-8 text-orange-600" />
      default:
        return <span className="text-2xl font-bold text-slate-600">{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">Результаты</h1>
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>

          {playerRank > 0 && (
            <Card className="border-4 border-yellow-300 bg-white/95 backdrop-blur shadow-2xl mb-6">
              <CardContent className="p-6">
                <p className="text-xl text-slate-600 mb-2">Ваш результат</p>
                <p className="text-4xl font-bold text-purple-600">{playerScore} баллов</p>
                <p className="text-lg text-slate-600 mt-2">
                  {playerRank === 1 ? "🎉 Вы победитель! 🎉" : `Место: ${playerRank}`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-4 border-white/30 bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Таблица лидеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400"
                      : index === 1
                        ? "bg-gradient-to-r from-slate-100 to-slate-200 border-2 border-slate-400"
                        : index === 2
                          ? "bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400"
                          : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(index + 1)}
                    <div>
                      <p className="font-bold text-lg text-slate-900">{entry.player_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{entry.total_score}</p>
                    <p className="text-sm text-slate-600">баллов</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-white text-purple-600 hover:bg-slate-100 font-bold px-8 py-6 text-xl">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
