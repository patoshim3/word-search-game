"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createQuizGame } from "@/app/actions/quiz-actions"

type Answer = {
  text: string
  isCorrect: boolean
}

type Question = {
  question: string
  timeLimit: number
  answers: Answer[]
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      timeLimit: 20,
      answers: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        timeLimit: 20,
        answers: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateAnswer = (qIndex: number, aIndex: number, field: keyof Answer, value: any) => {
    const updated = [...questions]
    const answers = [...updated[qIndex].answers]

    if (field === "isCorrect" && value === true) {
      answers.forEach((a, i) => {
        a.isCorrect = i === aIndex
      })
    } else {
      answers[aIndex] = { ...answers[aIndex], [field]: value }
    }

    updated[qIndex] = { ...updated[qIndex], answers }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const gameCode = await createQuizGame({
        title,
        description,
        questions: questions.map((q, i) => ({
          questionText: q.question,
          questionOrder: i + 1,
          timeLimit: q.timeLimit,
          answers: q.answers.map((a, j) => ({
            answerText: a.text,
            isCorrect: a.isCorrect,
            answerOrder: j + 1,
          })),
        })),
      })

      router.push(`/admin/quiz/preview/${gameCode}`)
    } catch (error) {
      console.error("[v0] Error creating quiz:", error)
      alert("Ошибка при создании викторины")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" className="text-blue-300 hover:text-blue-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к админ-панели
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Создать Quiz викторину</CardTitle>
            <CardDescription className="text-blue-200">Добавьте вопросы, ответы и настройки</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Название викторины
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Инновационные технологии"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание викторины..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Вопросы</h3>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить вопрос
                  </Button>
                </div>

                <div className="space-y-6">
                  {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="bg-slate-700/30 border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">Вопрос {qIndex + 1}</CardTitle>
                          {questions.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Текст вопроса</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                            placeholder="Введите вопрос..."
                            required
                            className="bg-slate-600/50 border-slate-500 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-slate-300">Время на ответ (секунды)</Label>
                          <Input
                            type="number"
                            value={question.timeLimit}
                            onChange={(e) => updateQuestion(qIndex, "timeLimit", Number.parseInt(e.target.value))}
                            min={5}
                            max={60}
                            className="bg-slate-600/50 border-slate-500 text-white"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-slate-300">Варианты ответов</Label>
                          {question.answers.map((answer, aIndex) => (
                            <div key={aIndex} className="flex gap-2 items-center">
                              <Button
                                type="button"
                                onClick={() => updateAnswer(qIndex, aIndex, "isCorrect", true)}
                                variant={answer.isCorrect ? "default" : "outline"}
                                size="sm"
                                className={answer.isCorrect ? "bg-green-600 hover:bg-green-700" : "border-slate-500"}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Input
                                value={answer.text}
                                onChange={(e) => updateAnswer(qIndex, aIndex, "text", e.target.value)}
                                placeholder={`Ответ ${aIndex + 1}`}
                                required
                                className="bg-slate-600/50 border-slate-500 text-white"
                              />
                            </div>
                          ))}
                          <p className="text-xs text-slate-400">Нажмите галочку, чтобы отметить правильный ответ</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Создание..." : "Создать викторину"}
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
