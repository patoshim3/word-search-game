"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Trophy, Medal, Award } from "lucide-react"

type LeaderboardEntry = {
  id: string
  player_name: string
  score: number
  completed_at: string
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("game_sessions")
        .select(`
          id,
          score,
          completed_at,
          players!inner (
            player_name
          )
        `)
        .not("completed_at", "is", null)
        .order("score", { ascending: false })
        .limit(10)

      if (error) {
        console.error("[v0] Error fetching leaderboard:", error)
        return
      }

      const formatted = data.map((entry: any) => ({
        id: entry.id,
        player_name: entry.players.player_name,
        score: entry.score,
        completed_at: entry.completed_at,
      }))

      setEntries(formatted)
    }

    fetchLeaderboard()

    // Subscribe to real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_sessions",
        },
        () => {
          fetchLeaderboard()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />
      default:
        return <span className="w-6 text-center font-bold text-purple-600">{index + 1}</span>
    }
  }

  return (
    <Card className="border-4 border-purple-400 shadow-2xl sticky top-4">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-300" />
          Таблица лидеров
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Пока никто не закончил игру</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 shadow-lg"
                    : index === 1
                      ? "bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300"
                        : "bg-purple-50 border-2 border-purple-200"
                }`}
              >
                <div className="flex items-center justify-center w-8">{getPositionIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{entry.player_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.completed_at).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-purple-700">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">баллов</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
