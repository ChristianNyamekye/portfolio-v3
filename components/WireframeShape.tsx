'use client'

import { useEffect, useRef } from 'react'

// Icosahedron — 12 vertices, 30 edges
const PHI = (1 + Math.sqrt(5)) / 2

const RAW_VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
]

// Normalise to unit sphere
const VERTICES = RAW_VERTS.map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z)
  return [x / len, y / len, z / len] as [number, number, number]
})

// All 30 edges of the icosahedron
const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9],
  [10, 11],
]

export default function WireframeShape({ size = 200 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    let animId: number
    let frame = 0

    const project = (v: [number, number, number]) => {
      // Slow rotation around Y axis, slight tilt on X
      const ry = frame * 0.005
      const rx = 0.28

      // Rotate Y
      const cosY = Math.cos(ry), sinY = Math.sin(ry)
      const x1 = v[0] * cosY - v[2] * sinY
      const z1 = v[0] * sinY + v[2] * cosY

      // Rotate X
      const cosX = Math.cos(rx), sinX = Math.sin(rx)
      const y1 = v[1] * cosX - z1 * sinX
      const z2 = v[1] * sinX + z1 * cosX

      // Weak perspective projection
      const fov = 3.2
      const scale = (size * 0.38 * fov) / (fov + z2)
      return {
        x: x1 * scale + size / 2,
        y: y1 * scale + size / 2,
        z: z2,
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      const projected = VERTICES.map((v) => project(v as [number, number, number]))

      // Draw edges — depth-based opacity
      EDGES.forEach(([a, b]) => {
        const pa = projected[a]
        const pb = projected[b]
        const avgZ = (pa.z + pb.z) / 2
        // Depth range is roughly -1 to 1
        const alpha = 0.08 + ((avgZ + 1) / 2) * 0.28
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(59,130,246,${Math.max(0.04, Math.min(0.38, alpha))})`
        ctx.lineWidth = 0.9
        ctx.stroke()
      })

      // Draw vertices
      projected.forEach((p) => {
        const alpha = 0.12 + ((p.z + 1) / 2) * 0.32
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59,130,246,${Math.max(0.06, Math.min(0.5, alpha))})`
        ctx.fill()
      })

      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pointer-events-none select-none"
      style={{ opacity: 0.75 }}
      aria-hidden="true"
    />
  )
}

