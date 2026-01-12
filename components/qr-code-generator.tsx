"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

export function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const url = `${window.location.origin}/game/enter`

    QRCode.toCanvas(
      canvas,
      url,
      {
        width: 260,                    // чуть больше — лучше читается
        margin: 2,
        errorCorrectionLevel: "M",     // добавляем запас прочности
        color: {
          dark: "#7c3aed",
          light: "#ffffff",
        },
      },
      (err) => {
        if (err) {
          console.error("Ошибка генерации QR:", err)
          setError("Не удалось сгенерировать QR-код")
        }
      }
    )
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-md">
      {error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="border-4 border-purple-300 rounded-lg shadow-lg"
          />
          <p className="text-sm text-muted-foreground font-medium">
            Отсканируйте для входа в игру
          </p>
        </>
      )}
    </div>
  )
}