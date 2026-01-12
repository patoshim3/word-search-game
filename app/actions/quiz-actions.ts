"use server"

import { createServerClient } from "@/lib/supabase/server"

type QuizQuestion = {
  questionText: string
  questionOrder: number
  timeLimit: number
  answers: {
    answerText: string
    isCorrect: boolean
    answerOrder: number
  }[]
}

export async function createQuizGame(data: {
  title: string
  description: string
  questions: QuizQuestion[]
}) {
  const supabase = await createServerClient()

  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data: game, error: gameError } = await supabase
    .from("quiz_games")
    .insert({
      game_code: gameCode,
      title: data.title,
      description: data.description,
      is_active: true,
    })
    .select()
    .single()

  if (gameError) throw gameError

  for (const question of data.questions) {
    const { data: questionData, error: questionError } = await supabase
      .from("quiz_questions")
      .insert({
        quiz_game_id: game.id,
        question_text: question.questionText,
        question_order: question.questionOrder,
        time_limit: question.timeLimit,
      })
      .select()
      .single()

    if (questionError) throw questionError

    const answers = question.answers.map((a) => ({
      question_id: questionData.id,
      answer_text: a.answerText,
      is_correct: a.isCorrect,
      answer_order: a.answerOrder,
    }))

    const { error: answersError } = await supabase.from("quiz_answers").insert(answers)

    if (answersError) throw answersError
  }

  return gameCode
}

export async function getQuizByCode(gameCode: string) {
  const supabase = await createServerClient()

  const { data: game, error: gameError } = await supabase
    .from("quiz_games")
    .select("*")
    .eq("game_code", gameCode)
    .eq("is_active", true)
    .single()

  if (gameError) throw gameError

  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select(`
      *,
      quiz_answers (*)
    `)
    .eq("quiz_game_id", game.id)
    .order("question_order")

  if (questionsError) throw questionsError

  return { game, questions }
}

export async function joinQuiz(gameCode: string, playerName: string) {
  const supabase = await createServerClient()

  const { data: game } = await supabase.from("quiz_games").select("id").eq("game_code", gameCode).single()

  if (!game) throw new Error("Game not found")

  const { data, error } = await supabase
    .from("quiz_participants")
    .insert({
      quiz_game_id: game.id,
      player_name: playerName,
      total_score: 0,
      current_question: 0,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function submitAnswer(participantId: string, questionId: string, answerId: string, timeTaken: number) {
  const supabase = await createServerClient()

  const { data: answer } = await supabase.from("quiz_answers").select("is_correct").eq("id", answerId).single()

  const pointsEarned = answer?.is_correct ? Math.max(500, 1000 - timeTaken * 10) : 0

  await supabase.from("quiz_responses").insert({
    participant_id: participantId,
    question_id: questionId,
    answer_id: answerId,
    time_taken: timeTaken,
    points_earned: pointsEarned,
  })

  const { data: participant } = await supabase
    .from("quiz_participants")
    .select("total_score, current_question")
    .eq("id", participantId)
    .single()

  await supabase
    .from("quiz_participants")
    .update({
      total_score: (participant?.total_score || 0) + pointsEarned,
      current_question: (participant?.current_question || 0) + 1,
    })
    .eq("id", participantId)

  return { pointsEarned, isCorrect: answer?.is_correct }
}

export async function getQuizLeaderboard(gameCode: string) {
  const supabase = await createServerClient()

  const { data: game } = await supabase.from("quiz_games").select("id").eq("game_code", gameCode).single()

  if (!game) return []

  const { data } = await supabase
    .from("quiz_participants")
    .select("player_name, total_score, completed")
    .eq("quiz_game_id", game.id)
    .order("total_score", { ascending: false })
    .limit(10)

  return data || []
}
