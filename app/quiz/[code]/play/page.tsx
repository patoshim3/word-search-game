"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Zap } from "lucide-react"
import confetti from "canvas-confetti"

type Answer = {
  id: string
  answer_text: string
  answer_order: number
}

type Question = {
  id: string
  question_text: string
  time_limit: number
  quiz_answers: Answer[]
}

const ANSWER_COLORS = [
  "from-red-500 to-red-600",
  "from-blue-500 to-blue-600",
  "from-yellow-500 to-yellow-600",
  "from-green-500 to-green-600",
]

export default function PlayQuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const searchParams = useSearchParams()
  const participantId = searchParams.get("participantId")
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [resultData, setResultData] = useState<{ pointsEarned: number; isCorrect: boolean } | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/quiz/${code}`)
      const data = await response.json()
      setQuestions(data.questions)
      setTimeLeft(data.questions[0]?.time_limit || 20)
    }

    fetchQuiz()
  }, [code])

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp()
    }
  }, [timeLeft, isAnswered])

  const handleTimeUp = async () => {
    setIsAnswered(true)
    setShowResult(true)
    setResultData({ pointsEarned: 0, isCorrect: false })

    setTimeout(() => {
      moveToNextQuestion()
    }, 2000)
  }

  const handleAnswerClick = async (answerId: string) => {
    if (isAnswered) return

    setSelectedAnswer(answerId)
    setIsAnswered(true)

    const currentQuestion = questions[currentQuestionIndex]
    const timeTaken = currentQuestion.time_limit - timeLeft

    const response = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantId,
        questionId: currentQuestion.id,
        answerId,
        timeTaken,
      }),
    })

    const data = await response.json()
    setResultData(data)
    setShowResult(true)
    setScore(score + data.pointsEarned)

    if (data.isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    setTimeout(() => {
      moveToNextQuestion()
    }, 2000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(questions[currentQuestionIndex + 1]?.time_limit || 20)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowResult(false)
      setResultData(null)
    } else {
      router.push(`/quiz/${code}/results?participantId=${participantId}`)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-white font-bold">
                Вопрос {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <p className="text-white font-bold">{score}</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 flex items-center gap-3">
            <Clock className={`w-6 h-6 ${timeLeft <= 5 ? "text-red-300 animate-pulse" : "text-white"}`} />
            <p className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-300" : "text-white"}`}>{timeLeft}s</p>
          </div>
        </div>

        <Progress value={progress} className="mb-6 h-2 bg-white/20" />

        <Card className="border-4 border-white/30 bg-white/95 backdrop-blur shadow-2xl mb-6">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">{currentQuestion.question_text}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.quiz_answers
                .sort((a, b) => a.answer_order - b.answer_order)
                .map((answer, index) => {
                  const isSelected = selectedAnswer === answer.id
                  const showCorrect = isAnswered && answer.is_correct
                  const showWrong = isAnswered && isSelected && !answer.is_correct

                  return (
                    <Button
                      key={answer.id}
                      onClick={() => handleAnswerClick(answer.id)}
                      disabled={isAnswered}
                      className={`
                        h-24 text-lg font-bold transition-all transform hover:scale-105
                        ${!isAnswered ? `bg-gradient-to-r ${ANSWER_COLORS[index]} text-white hover:opacity-90` : ""}
                        ${showCorrect ? "bg-gradient-to-r from-green-500 to-green-600 text-white ring-4 ring-green-300" : ""}
                        ${showWrong ? "bg-gradient-to-r from-red-500 to-red-600 text-white ring-4 ring-red-300" : ""}
                        ${isAnswered && !showCorrect && !showWrong ? "opacity-50" : ""}
                      `}
                    >
                      {answer.answer_text}
                    </Button>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {showResult && resultData && (
          <Card
            className={`border-4 ${resultData.isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"} shadow-2xl animate-in slide-in-from-bottom`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {resultData.isCorrect ? (
                  <>
                    <Zap className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-green-600">Правильно!</h3>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-red-600">Неправильно</h3>
                  </>
                )}
              </div>
              <p className="text-xl font-semibold text-slate-700">
                {resultData.isCorrect ? `+${resultData.pointsEarned} баллов` : "Попробуйте следующий вопрос!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
