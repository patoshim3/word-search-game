import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function ManageWordSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Управление Word Search</h1>
            <p className="text-purple-200">Просмотр и редактирование ваших игр</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-purple-500/50 text-purple-300 bg-transparent">
              Назад
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-purple-500/20 bg-slate-800/50 backdrop-blur">
          <CardContent className="p-12 text-center">
            <Gamepad2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Функция в разработке</h3>
            <p className="text-slate-400 mb-6">Управление Word Search играми скоро будет доступно</p>
            <Link href="/admin/word-search/create">
              <Button className="bg-purple-600 hover:bg-purple-700">Создать игру</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
