"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Timer, Trophy, Zap, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

type Player = {
  id: string
  player_name: string
}

type Props = {
  player: Player
}

type GridCell = {
  letter: string
  row: number
  col: number
}

type FoundWordPosition = {
  word: string
  cells: GridCell[]
}

export function WordSearchGame({ player }: Props) {
  const router = useRouter()
  const [stage, setStage] = useState(1)
  const [grid, setGrid] = useState<string[][]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [foundWordPositions, setFoundWordPositions] = useState<FoundWordPosition[]>([])
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      return Number.parseInt(localStorage.getItem("customGameTime") || "600")
    }
    return 600
  })
  const [gameSessionId, setGameSessionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [stage1Words, setStage1Words] = useState<string[]>([])
  const [stage2Words, setStage2Words] = useState<string[]>([])

  const currentWords = stage === 1 ? stage1Words : stage2Words

  useEffect(() => {
    const customStage1 = localStorage.getItem("customStage1Words")
    const customStage2 = localStorage.getItem("customStage2Words")

    const defaultStage1 = [
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

    const defaultStage2 = [
      "САТУРН", "ЮПИТЕР", "НЕПТУН", "МАРС", "ВЕНЕРА",
      "ЗЕМЛЯ", "МЕРКУРИЙ", "УРАН", "ПЛУТОН"
    ]

    // Приводим все слова к верхнему регистру и убираем дубликаты
    const normalize = (words: string[]) =>
      [...new Set(words.map(w => w.trim().toUpperCase()))]

    setStage1Words(normalize(customStage1 ? JSON.parse(customStage1) : defaultStage1))
    setStage2Words(normalize(customStage2 ? JSON.parse(customStage2) : defaultStage2))
  }, [])

  const generateGrid = useCallback((words: string[]) => {
    // Размер сетки: больше для первого этапа (там длинные слова)
    const size = stage === 1 ? 22 : 15

    const grid: string[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(""))

    // Все 8 возможных направлений
    const directions = [
      [0, 1],   // →
      [1, 0],   // ↓
      [1, 1],   // ↘
      [1, -1],  // ↙
      [0, -1],  // ←
      [-1, 0],  // ↑
      [-1, -1], // ↖
      [-1, 1]   // ↗
    ]
    const sortedWords = [...words].sort((a, b) => b.length - a.length)

    const canPlaceWord = (word: string, row: number, col: number, dRow: number, dCol: number): boolean => {
      for (let i = 0; i < word.length; i++) {
        const r = row + dRow * i
        const c = col + dCol * i
        if (r < 0 || r >= size || c < 0 || c >= size) return false
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false
      }
      return true
    }

    const placeWord = (word: string, row: number, col: number, dRow: number, dCol: number) => {
      for (let i = 0; i < word.length; i++) {
        const r = row + dRow * i
        const c = col + dCol * i
        grid[r][c] = word[i]
      }
    }

    // Пытаемся разместить каждое слово
    sortedWords.forEach((word) => {
      let placed = false
      let attempts = 0
      const maxAttempts = 1500 // увеличено для надёжности

      while (!placed && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * size)
        const col = Math.floor(Math.random() * size)
        const dirIndex = Math.floor(Math.random() * directions.length)
        const [dRow, dCol] = directions[dirIndex]

        if (canPlaceWord(word, row, col, dRow, dCol)) {
          placeWord(word, row, col, dRow, dCol)
          placed = true
        }
        attempts++
      }

      // Если не получилось — можно добавить логирование в консоль при разработке
      // if (!placed) console.warn(`Не удалось разместить слово: ${word}`)
    })

    // Заполняем оставшиеся клетки кириллицей (для обоих этапов)
    const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯӘІҢҒҮҰҚӨҺ"

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)]
        }
      }
    }

    return grid
  }, [stage])

  // Инициализация игры (только один раз при монтировании)
  useEffect(() => {
    if (stage1Words.length === 0) return

    const initGame = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("game_sessions")
        .insert({
          player_id: player.id,
          stage: 1,
          score: 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Ошибка создания сессии:", error)
        return
      }

      setGameSessionId(data.id)
      setGrid(generateGrid(stage1Words))
    }

    initGame()
  }, [player.id, stage1Words, generateGrid])

  // Таймер
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleTimeUp = () => {
    if (stage === 1) {
      setStage(2)
      const customTime = Number.parseInt(localStorage.getItem("customGameTime") || "600")
      setTimeLeft(customTime)
      setFoundWords([])
      setFoundWordPositions([])
      setGrid(generateGrid(stage2Words))

      const supabase = createClient()
      supabase.from("game_sessions").update({ stage: 2 }).eq("id", gameSessionId)
    } else {
      finishGame()
    }
  }

  const finishGame = async () => {
    const supabase = createClient()
    await supabase
      .from("game_sessions")
      .update({
        score,
        completed_at: new Date().toISOString(),
      })
      .eq("id", gameSessionId)

    router.push(`/game/results?score=${score}`)
  }

  // ──────────────────────────────────────────────
  // Логика выбора ячеек (click / drag)
  // ──────────────────────────────────────────────

  const handleCellClick = (row: number, col: number) => {
    const cell = { letter: grid[row][col], row, col }

    if (selectedCells.length === 0) {
      setSelectedCells([cell])
      return
    }

    const last = selectedCells[selectedCells.length - 1]

    // Двойной клик по последней букве → проверка
    if (row === last.row && col === last.col && selectedCells.length > 1) {
      checkWord()
      return
    }

    const dr = row - last.row
    const dc = col - last.col
    const isAdjacent = Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0)

    if (!isAdjacent) {
      setSelectedCells([cell])
      return
    }

    // Проверка направления (если уже ≥2 клетки)
    if (selectedCells.length >= 2) {
      const prev = selectedCells[selectedCells.length - 2]
      const prevDr = last.row - prev.row
      const prevDc = last.col - prev.col

      const expectedDr = prevDr === 0 ? 0 : prevDr / Math.abs(prevDr)
      const expectedDc = prevDc === 0 ? 0 : prevDc / Math.abs(prevDc)

      const actualDr = dr === 0 ? 0 : dr / Math.abs(dr)
      const actualDc = dc === 0 ? 0 : dc / Math.abs(dc)

      if (expectedDr !== actualDr || expectedDc !== actualDc) {
        setSelectedCells([cell])
        return
      }
    }

    if (!selectedCells.some(c => c.row === row && c.col === col)) {
      setSelectedCells([...selectedCells, cell])
    }
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([{ letter: grid[row][col], row, col }])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || selectedCells.length === 0) return

    const last = selectedCells[selectedCells.length - 1]
    const dr = row - last.row
    const dc = col - last.col

    if (Math.abs(dr) > 1 || Math.abs(dc) > 1 || (dr === 0 && dc === 0)) return

    if (selectedCells.length >= 2) {
      const prev = selectedCells[selectedCells.length - 2]
      const prevDr = last.row - prev.row
      const prevDc = last.col - prev.col

      const expDr = prevDr === 0 ? 0 : prevDr / Math.abs(prevDr)
      const expDc = prevDc === 0 ? 0 : prevDc / Math.abs(prevDc)

      const actDr = dr === 0 ? 0 : dr / Math.abs(dr)
      const actDc = dc === 0 ? 0 : dc / Math.abs(dc)

      if (expDr !== actDr || expDc !== actDc) return
    }

    if (!selectedCells.some(c => c.row === row && c.col === col)) {
      setSelectedCells([...selectedCells, { letter: grid[row][col], row, col }])
    }
  }

  const handleCellMouseUp = () => {
    setIsSelecting(false)
    if (selectedCells.length > 1) checkWord()
  }

  const checkWord = () => {
    const word = selectedCells.map(c => c.letter).join("")

    if (currentWords.includes(word) && !foundWords.includes(word)) {
      const newFound = [...foundWords, word]
      const points = word.length * 10
      const newScore = score + points

      setFoundWords(newFound)
      setFoundWordPositions([...foundWordPositions, { word, cells: [...selectedCells] }])
      setScore(newScore)

      const supabase = createClient()
      supabase
        .from("game_sessions")
        .update({
          words_found: newFound,
          score: newScore
        })
        .eq("id", gameSessionId)

      // Все слова найдены → переход
      if (newFound.length === currentWords.length) {
        setTimeout(() => {
          if (stage === 1) {
            setStage(2)
            const customTime = Number.parseInt(localStorage.getItem("customGameTime") || "600")
            setTimeLeft(customTime)
            setFoundWords([])
            setFoundWordPositions([])
            setGrid(generateGrid(stage2Words))

            const supabase = createClient()
            supabase.from("game_sessions").update({ stage: 2 }).eq("id", gameSessionId)
          } else {
            finishGame()
          }
        }, 600)
      }
    }

    setSelectedCells([])
  }

  const isCellSelected = (row: number, col: number) =>
    selectedCells.some(c => c.row === row && c.col === col)

  const isCellInFoundWord = (row: number, col: number) =>
    foundWordPositions.some(pos => pos.cells.some(c => c.row === row && c.col === col))

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Card className="border-4 border-purple-500 bg-gradient-to-br from-purple-700 to-fuchsia-700 shadow-2xl">
        <CardHeader className="p-5 md:p-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <div>
                <CardTitle className="text-2xl md:text-3xl text-white font-extrabold">
                  {stage === 1 ? "1-кезең: Қазақша" : "2-кезең: Ағылшынша / планеталар"}
                </CardTitle>
                <p className="text-purple-100 mt-1">{player.player_name}</p>
              </div>
            </div>

            <div className="text-center md:text-right space-y-2">
              <div className="flex items-center justify-center md:justify-end gap-3 text-white">
                <Timer className="w-7 h-7" />
                <span className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-3 text-yellow-300">
                <Zap className="w-6 h-6" />
                <span className="text-2xl font-bold">{score} ұпай</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Список слов */}
      <Card className="border-2 border-purple-300 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            {currentWords.map(word => (
              <div
                key={word}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  foundWords.includes(word)
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-purple-100 text-purple-800 border border-purple-200"
                }`}
              >
                {foundWords.includes(word) && <CheckCircle className="w-4 h-4" />}
                {word}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Табылды: {foundWords.length} / {currentWords.length}
          </p>
        </CardContent>
      </Card>

      {/* Игровое поле */}
      <Card className="border-4 border-purple-400 shadow-2xl overflow-hidden">
        <CardContent className="p-4 md:p-8">
          <div className="flex justify-center overflow-x-auto pb-4">
            <div
              className="inline-block select-none touch-none"
              onMouseUp={handleCellMouseUp}
              onMouseLeave={() => setIsSelecting(false)}
            >
              <div
                className="grid gap-0.5 sm:gap-1"
                style={{
                  gridTemplateColumns: `repeat(${grid[0]?.length || 15}, minmax(0, 1fr))`
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => {
                    const selected = isCellSelected(rowIndex, colIndex)
                    const found = isCellInFoundWord(rowIndex, colIndex)

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square flex items-center justify-center font-bold 
                          text-base sm:text-lg md:text-xl rounded transition-all duration-150
                          cursor-pointer select-none touch-manipulation
                          ${selected
                            ? "bg-yellow-300 text-purple-900 scale-110 shadow-lg z-10"
                            : found
                              ? "bg-green-500 text-white shadow-md"
                              : "bg-white hover:bg-purple-50 border border-purple-200"
                          }
                        `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          handleCellClick(rowIndex, colIndex)
                        }}
                      >
                        {letter}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Бас әріптен бастап сөзді таңдаңыз. Соңғы әріпті екі рет басыңыз — тексеру
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={finishGame}
          variant="outline"
          className="border-2 border-red-400 text-red-600 hover:bg-red-50"
        >
          Ойынды мерзімінен бұрын аяқтау
        </Button>
      </div>
    </div>
  )
}