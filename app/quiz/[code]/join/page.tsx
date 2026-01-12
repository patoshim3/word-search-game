"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Sparkles } from "lucide-react"
import { use } from "react"

export default function JoinQuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsJoining(true)

    try {
      const response = await fetch("/api/quiz/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameCode: code, playerName }),
      })

      if (!response.ok) throw new Error("Failed to join")

      const data = await response.json()

      router.push(`/quiz/${code}/play?participantId=${data.participantId}`)
    } catch (error) {
      console.error("[v0] Error joining quiz:", error)
      alert("Ошибка при входе в викторину. Возможно, вы уже играли с этим именем.")
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-white/20 bg-white/95 backdrop-blur shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Присоединиться к Quiz
          </CardTitle>
          <CardDescription className="text-lg">
            Код игры: <span className="font-bold text-purple-600">{code}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-lg">
                Введите ваше имя
              </Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ваше имя..."
                required
                className="text-lg p-6 border-2 border-purple-200 focus:border-purple-500"
                autoFocus
              />
              <p className="text-sm text-slate-600">Вы можете играть только один раз с этим именем</p>
            </div>

            <Button
              type="submit"
              disabled={isJoining}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 text-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isJoining ? "Подключение..." : "Начать игру"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
