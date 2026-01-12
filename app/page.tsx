"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Trophy, Zap, Gamepad2, Brain, Settings, Edit3 } from "lucide-react"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">Игровая Платформа</h1>
            <Zap className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-purple-100 font-medium">Выберите игру и начните соревнование!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-4 border-purple-200 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Gamepad2 className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-2xl">Найди Слово</CardTitle>
              </div>
              <CardDescription className="text-base">Word Search Game - 10 минут на раунд</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 mb-4">
                Найдите все спрятанные слова на казахском и английском языках за ограниченное время!
              </p>
              <Link href="/game/enter">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
                  Играть со стандартными словами
                </Button>
              </Link>
              <Link href="/game/customize">
                <Button
                  variant="outline"
                  className="w-full border-2 border-purple-400 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Настроить слова
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-4 border-purple-200 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                1-кезең
              </CardTitle>
              <CardDescription className="text-base">Қазақша сөздер - 10 минут</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Инновация, Жаңалық, Өзгеріс</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Трансформация, Жаңарту</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Үдемелі, Инфрақұрылым</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Тренд, Ұйым</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Жасампаздық, Радикалдық</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-4 border-fuchsia-200 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-fuchsia-600" />
                2-кезең
              </CardTitle>
              <CardDescription className="text-base">Қазақша сөздер - 10 минут</CardDescription>
            </CardHeader>
            <CardContent>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>САТУРН, ЮПИТЕР, НЕПТУН</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>МАРС, ВЕНЕРА</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>ЗЕМЛЯ, МЕРКУРИЙ</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>УРАН, ПЛУТОН</span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>

        <Card className="border-4 border-yellow-300 shadow-2xl bg-white/95 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Быстрый старт</CardTitle>
            <CardDescription className="text-center">Отсканируйте QR-код для быстрого входа</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <QRCodeGenerator />
          </CardContent>
        </Card>

        <div className="text-center text-purple-100 text-sm space-y-1">
          <p className="font-semibold">Найдите все слова быстрее всех и станьте чемпионом!</p>
          <p className="text-xs">Нажимайте буквы по порядку. Найденные слова выделяются зеленым цветом.</p>
        </div>
      </div>
    </div>
  )
}
