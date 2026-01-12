export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white text-xl font-semibold">Загрузка результатов...</p>
      </div>
    </div>
  )
}
