"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Play, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

const DEFAULT_STAGE_1_WORDS = [
      "Инновация",
      "Жаңалық",
      "Өзгеріс",
      "Трансформация",
      "Жаңарту",
      "Радикалдық",
      "Үдемелі",
      "Тренд",
      "Инфрақұрылым",
      "Ұйым",
      "Жасампаздық"
]

const DEFAULT_STAGE_2_WORDS = [
  "САТУРН", "ЮПИТЕР", "НЕПТУН", "МАРС", "ВЕНЕРА",
  "ЗЕМЛЯ", "МЕРКУРИЙ", "УРАН", "ПЛУТОН"
]

export default function CustomizeGamePage() {
  const router = useRouter()
  const [stage1Words, setStage1Words] = useState<string[]>(DEFAULT_STAGE_1_WORDS)
  const [stage2Words, setStage2Words] = useState<string[]>(DEFAULT_STAGE_2_WORDS)
  const [gameTime, setGameTime] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number.parseInt(localStorage.getItem("customGameTime") || "300")
    }
    return 300
  })
  const [newWord1, setNewWord1] = useState("")
  const [newWord2, setNewWord2] = useState("")
  const [editingIndex1, setEditingIndex1] = useState<number | null>(null)
  const [editingIndex2, setEditingIndex2] = useState<number | null>(null)
  const [editValue1, setEditValue1] = useState("")
  const [editValue2, setEditValue2] = useState("")

  const handleAddWord1 = () => {
    if (newWord1.trim() && !stage1Words.includes(newWord1.trim().toUpperCase())) {
      setStage1Words([...stage1Words, newWord1.trim().toUpperCase()])
      setNewWord1("")
    }
  }

  const handleAddWord2 = () => {
    if (newWord2.trim() && !stage2Words.includes(newWord2.trim().toUpperCase())) {
      setStage2Words([...stage2Words, newWord2.trim().toUpperCase()])
      setNewWord2("")
    }
  }

  const handleDeleteWord1 = (index: number) => {
    setStage1Words(stage1Words.filter((_, i) => i !== index))
  }

  const handleDeleteWord2 = (index: number) => {
    setStage2Words(stage2Words.filter((_, i) => i !== index))
  }

  const handleEditWord1 = (index: number) => {
    setEditingIndex1(index)
    setEditValue1(stage1Words[index])
  }

  const handleEditWord2 = (index: number) => {
    setEditingIndex2(index)
    setEditValue2(stage2Words[index])
  }

  const handleSaveEdit1 = (index: number) => {
    if (editValue1.trim()) {
      const newWords = [...stage1Words]
      newWords[index] = editValue1.trim().toUpperCase()
      setStage1Words(newWords)
    }
    setEditingIndex1(null)
    setEditValue1("")
  }

  const handleSaveEdit2 = (index: number) => {
    if (editValue2.trim()) {
      const newWords = [...stage2Words]
      newWords[index] = editValue2.trim().toUpperCase()
      setStage2Words(newWords)
    }
    setEditingIndex2(null)
    setEditValue2("")
  }

  const handleStartGame = () => {
    localStorage.setItem("customGameTime", gameTime.toString())
    localStorage.setItem("customStage1Words", JSON.stringify(stage1Words))
    localStorage.setItem("customStage2Words", JSON.stringify(stage2Words))
    router.push("/game/enter")
  }

  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-white/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white text-center mb-2">Настройка слов</h1>
          <p className="text-purple-100 text-center">Добавьте, удалите или измените слова для игры</p>
        </div>

        <Card className="border-4 border-yellow-300 shadow-2xl bg-white/95 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Время на раунд
            </CardTitle>
            <CardDescription>Установите время для каждого раунда (в секундах)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="60"
                max="600"
                step="30"
                value={gameTime}
                onChange={(e) => setGameTime(Number.parseInt(e.target.value) || 300)}
                className="w-32 text-lg font-bold"
              />
              <span className="text-2xl font-bold text-purple-600">{formatTimeDisplay(gameTime)}</span>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => setGameTime(180)} variant="outline" size="sm">
                  3 мин
                </Button>
                <Button onClick={() => setGameTime(300)} variant="outline" size="sm">
                  5 мин
                </Button>
                <Button onClick={() => setGameTime(420)} variant="outline" size="sm">
                  7 мин
                </Button>
                <Button onClick={() => setGameTime(600)} variant="outline" size="sm">
                  10 мин
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Stage 1 - Kazakh */}
          <Card className="border-4 border-yellow-300 shadow-2xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">1-кезең: Қазақша</CardTitle>
              <CardDescription>Казахские слова для первого раунда</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new word */}
              <div className="flex gap-2">
                <Input
                  placeholder="Новое слово..."
                  value={newWord1}
                  onChange={(e) => setNewWord1(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddWord1()}
                  className="flex-1"
                />
                <Button onClick={handleAddWord1} size="icon" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Word list */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stage1Words.map((word, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    {editingIndex1 === index ? (
                      <>
                        <Input
                          value={editValue1}
                          onChange={(e) => setEditValue1(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSaveEdit1(index)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button onClick={() => handleSaveEdit1(index)} size="sm" className="bg-green-600">
                          Сохранить
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 font-semibold text-purple-700">{word}</span>
                        <Button onClick={() => handleEditWord1(index)} size="icon" variant="ghost" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteWord1(index)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Всего слов: {stage1Words.length}</p>
            </CardContent>
          </Card>

          {/* Stage 2 - English */}
          <Card className="border-4 border-yellow-300 shadow-2xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">Stage 2: English</CardTitle>
              <CardDescription>English words for second round</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new word */}
              <div className="flex gap-2">
                <Input
                  placeholder="New word..."
                  value={newWord2}
                  onChange={(e) => setNewWord2(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddWord2()}
                  className="flex-1"
                />
                <Button onClick={handleAddWord2} size="icon" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Word list */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stage2Words.map((word, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    {editingIndex2 === index ? (
                      <>
                        <Input
                          value={editValue2}
                          onChange={(e) => setEditValue2(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSaveEdit2(index)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button onClick={() => handleSaveEdit2(index)} size="sm" className="bg-green-600">
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 font-semibold text-purple-700">{word}</span>
                        <Button onClick={() => handleEditWord2(index)} size="icon" variant="ghost" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteWord2(index)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Total words: {stage2Words.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-12 py-6 text-xl shadow-2xl"
          >
            <Play className="w-6 h-6 mr-2" />
            Начать игру с этими словами
          </Button>
        </div>
      </div>
    </div>
  )
}
