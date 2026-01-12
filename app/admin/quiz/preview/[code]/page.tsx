"use client"

import { useEffect, useState, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import QRCode from "qrcode"

type QuizData = {
  game: {
    title: string
    description: string
    game_code: string
  }
  questions: Array<{
    question_text: string
    time_limit: number
    quiz_answers: Array<{
      answer_text: string
      is_correct: boolean
    }>
  }>
}

export default function QuizPreviewPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [qrCode, setQrCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/quiz/${code}`)
      const data = await response.json()
      setQuiz(data)

      const url = `${window.location.origin}/quiz/${code}/join`
      const qr = await QRCode.toDataURL(url, { width: 300 })
      setQrCode(qr)
    }

    fetchQuiz()
  }, [code])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${code}/join`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Викторина готова!</h1>
          </div>
          <p className="text-blue-200">Поделитесь кодом или QR-кодом с участниками</p>
        </div>

        <Card className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{quiz.game.title}</CardTitle>
            <CardDescription className="text-blue-200">{quiz.game.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-slate-300 mb-2">Код игры</p>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-blue-600 text-white px-8 py-4 rounded-lg text-4xl font-bold tracking-wider">
                  {code}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-blue-500/50 text-blue-300 bg-transparent"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {qrCode && (
              <div className="text-center">
                <p className="text-slate-300 mb-4">QR-код для входа</p>
                <div className="flex justify-center">
                  <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="bg-white p-4 rounded-lg shadow-xl" />
                </div>
              </div>
            )}

            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-slate-300 mb-2">Статистика викторины:</p>
              <ul className="space-y-1 text-blue-200">
                <li>Количество вопросов: {quiz.questions.length}</li>
                <li>
                  Среднее время на вопрос:{" "}
                  {Math.round(quiz.questions.reduce((sum, q) => sum + q.time_limit, 0) / quiz.questions.length)} сек
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link href={`/quiz/${code}/join`} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть игру
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="border-blue-500/50 text-blue-300 bg-transparent">
                  Вернуться
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Вопросы викторины</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.questions.map((q, index) => (
                <Card key={index} className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {index + 1}. {q.question_text}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Время: {q.time_limit} секунд</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {q.quiz_answers.map((a, aIndex) => (
                        <div
                          key={aIndex}
                          className={`p-3 rounded-lg ${a.is_correct ? "bg-green-500/20 border border-green-500/50" : "bg-slate-600/50"}`}
                        >
                          <span className="text-white">
                            {a.answer_text} {a.is_correct && "✓"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
