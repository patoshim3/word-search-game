"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, ExternalLink, Trash2, Eye } from "lucide-react"
import Link from "next/link"

type QuizGame = {
  id: string
  game_code: string
  title: string
  description: string
  is_active: boolean
  created_at: string
}

export default function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizGame[]>([])

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const response = await fetch("/api/quiz/list")
    const data = await response.json()
    setQuizzes(data)
  }

  const deleteQuiz = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту викторину?")) return

    await fetch(`/api/quiz/delete/${id}`, { method: "DELETE" })
    fetchQuizzes()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Управление викторинами</h1>
            <p className="text-blue-200">Просмотр и редактирование ваших quiz игр</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-blue-500/50 text-blue-300 bg-transparent">
              Назад
            </Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <Card className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Нет викторин</h3>
              <p className="text-slate-400 mb-6">Создайте свою первую викторину</p>
              <Link href="/admin/quiz/create">
                <Button className="bg-blue-600 hover:bg-blue-700">Создать викторину</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-white">{quiz.title}</CardTitle>
                      <CardDescription className="text-blue-200">{quiz.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-slate-400">Код: {quiz.game_code}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${quiz.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {quiz.is_active ? "Активна" : "Неактивна"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/quiz/preview/${quiz.game_code}`}>
                        <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 bg-transparent">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/quiz/${quiz.game_code}/join`}>
                        <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuiz(quiz.id)}
                        className="border-red-500/50 text-red-300 bg-transparent hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
