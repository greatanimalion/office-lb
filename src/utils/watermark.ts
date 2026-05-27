interface WatermarkOptions {
  text: string
  fontSize?: number
  opacity?: number
  rotate?: number
  color?: string
}

export function createWatermark(options: WatermarkOptions): string {
  const {
    text,
    fontSize = 16,
    opacity = 0.1,
    rotate = -30,
    color = '#000',
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 150
  const ctx = canvas.getContext('2d')

  if (!ctx) return ''

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = opacity
  ctx.font = `${fontSize}px sans-serif`
  ctx.fillStyle = color
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 0)

  return canvas.toDataURL('image/png')
}

export function applyWatermark(container: HTMLElement, options: WatermarkOptions) {
  const watermarkUrl = createWatermark(options)
  if (!watermarkUrl) return

  const existing = container.querySelector('.watermark-overlay')
  if (existing) {
    container.removeChild(existing)
  }

  const overlay = document.createElement('div')
  overlay.className = 'watermark-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    background-image: url(${watermarkUrl});
    background-repeat: repeat;
  `
  container.appendChild(overlay)
}

export function removeWatermark(container: HTMLElement) {
  const overlay = container.querySelector('.watermark-overlay')
  if (overlay) {
    container.removeChild(overlay)
  }
}