"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { User, Sparkles } from "lucide-react"

export default function EnterGamePage() {
  const [playerName, setPlayerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Check if player already exists
      const { data: existingPlayer } = await supabase
        .from("players")
        .select("id")
        .eq("player_name", playerName.trim())
        .single()

      if (existingPlayer) {
        // Check if player has completed game
        const { data: completedSession } = await supabase
          .from("game_sessions")
          .select("id")
          .eq("player_id", existingPlayer.id)
          .not("completed_at", "is", null)
          .single()

        if (completedSession) {
          setError("Вы уже прошли игру! Каждый игрок может играть только один раз.")
          setIsLoading(false)
          return
        }
      }

      // Create or get player
      const { data: player, error: playerError } = await supabase
        .from("players")
        .upsert({ player_name: playerName.trim() }, { onConflict: "player_name" })
        .select()
        .single()

      if (playerError) throw playerError

      // Store player info in localStorage
      localStorage.setItem("currentPlayer", JSON.stringify(player))

      router.push("/game/play")
    } catch (err) {
      console.error("[v0] Error entering game:", err)
      setError("Ошибка при входе в игру. Попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-yellow-300 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-purple-600 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Добро пожаловать!
          </CardTitle>
          <CardDescription className="text-base">Введите ваше имя для начала игры</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEnter} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-base font-semibold">
                Ваше имя
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Введите имя..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                  className="pl-10 text-lg h-12 border-2 border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || playerName.trim().length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-6 text-lg shadow-lg"
            >
              {isLoading ? "Загрузка..." : "Начать игру"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
