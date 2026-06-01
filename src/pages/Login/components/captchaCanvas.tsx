import { useEffect, useRef } from "react";

export default function CaptchaCanvas({ captcha, onRefresh }: { captcha: string; onRefresh: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, '#f5f5f5')
    bgGradient.addColorStop(1, '#e8e8e8')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      )
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.3)`
      ctx.lineWidth = 1 + Math.random() * 2
      ctx.stroke()
    }

    for (let i = 0; i < 30; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.5)`
      ctx.fill()
    }

    const charWidth = width / captcha.length
    captcha.split('').forEach((char, index) => {
      const x = index * charWidth + charWidth / 2
      const y = height / 2 + Math.sin(index * 1.5) * 5

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((Math.random() - 0.5) * 0.5)
      
      const gradient = ctx.createLinearGradient(-20, -15, 20, 15)
      const colors = ['#333', '#666', '#999', '#000']
      gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)])
      gradient.addColorStop(1, colors[Math.floor(Math.random() * colors.length)])
      
      ctx.font = `${24 + Math.random() * 8}px Arial Black, sans-serif`
      ctx.fillStyle = gradient
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const offsetX = (Math.random() - 0.5) * 4
      const offsetY = (Math.random() - 0.5) * 4
      ctx.fillText(char, offsetX, offsetY)
      
      ctx.restore()
    })
  }, [captcha])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={160}
        height={60}
        className="rounded-lg cursor-pointer"
        onClick={onRefresh}
      />
    </div>
  )
}
