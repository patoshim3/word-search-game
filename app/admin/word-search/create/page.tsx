"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CreateWordSearchPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [stage, setStage] = useState(1)
  const [language, setLanguage] = useState("kazakh")
  const [words, setWords] = useState<string[]>([""])
  const [timeLimit, setTimeLimit] = useState(180)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addWord = () => {
    setWords([...words, ""])
  }

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index))
  }

  const updateWord = (index: number, value: string) => {
    const updated = [...words]
    updated[index] = value
    setWords(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/word-search/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          stage,
          language,
          words: words.filter((w) => w.trim() !== ""),
          timeLimit,
        }),
      })

      const data = await response.json()
      router.push(`/admin/word-search/preview/${data.gameCode}`)
    } catch (error) {
      console.error("[v0] Error creating word search:", error)
      alert("Ошибка при создании игры")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" className="text-purple-300 hover:text-purple-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к админ-панели
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-purple-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Создать игру "Найди слово"</CardTitle>
            <CardDescription className="text-purple-200">Настройте слова и параметры игры</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Название игры
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Инновационные слова"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="stage" className="text-white">
                    Уровень (Stage)
                  </Label>
                  <Input
                    id="stage"
                    type="number"
                    value={stage}
                    onChange={(e) => setStage(Number.parseInt(e.target.value))}
                    min={1}
                    max={10}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="text-white">
                    Язык
                  </Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-600 bg-slate-700/50 px-3 text-white"
                  >
                    <option value="kazakh">Қазақша</option>
                    <option value="english">English</option>
                    <option value="russian">Русский</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="timeLimit" className="text-white">
                    Время (секунды)
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                    min={60}
                    max={600}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Слова для поиска</Label>
                  <Button
                    type="button"
                    onClick={addWord}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/50 text-purple-300 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить слово
                  </Button>
                </div>
                <div className="space-y-2">
                  {words.map((word, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={word}
                        onChange={(e) => updateWord(index, e.target.value)}
                        placeholder={`Слово ${index + 1}`}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                      {words.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeWord(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSubmitting ? "Создание..." : "Создать игру"}
                </Button>
                <Link href="/admin">
                  <Button type="button" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                    Отмена
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
