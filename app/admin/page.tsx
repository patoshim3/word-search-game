import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Brain, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-purple-200">Управление играми и создание новых викторин</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-purple-500/20 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Gamepad2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Word Search</CardTitle>
                    <CardDescription className="text-purple-200">Игра "Найди слово"</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Создавайте и управляйте играми поиска слов с настраиваемыми словами и уровнями сложности.
              </p>
              <div className="flex gap-2">
                <Link href="/admin/word-search/create" className="flex-1">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Создать игру
                  </Button>
                </Link>
                <Link href="/admin/word-search/manage">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/20 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Quiz Game</CardTitle>
                    <CardDescription className="text-blue-200">Викторина в стиле Kahoot</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Создавайте интерактивные викторины с вопросами и ответами, отслеживайте результаты в реальном времени.
              </p>
              <div className="flex gap-2">
                <Link href="/admin/quiz/create" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Создать викторину
                  </Button>
                </Link>
                <Link href="/admin/quiz/manage">
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
