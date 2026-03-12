'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

const GRAVITY = 0.25
const PENDULUM_DELAY = 1250
const PENDULUM_RELEASE = 8000
const RESTITUTION_TEXT = 0.2
const RESTITUTION_IMG = 0.75
const FRICTION_TEXT = 0.007
const FRICTION_IMG = 0.05
const AIR_TEXT = 0.001
const AIR_IMG = 0.01
const WALL_THICKNESS = 100 // Thicker walls to prevent escape

interface TextItem {
  label: string
  x: number
  y: number
  w: number
  h: number
  angle: number
  isLink: boolean
  href: string | null
  fill: string
  isBrand?: boolean
}

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = window.innerWidth
    const H = window.innerHeight

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // Theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const bgColor = isDark ? '#111111' : '#f7f5f2'
    const textColor = isDark ? '#e8e6e3' : '#000000'
    const linkColor = isDark ? '#5b8def' : '#2563eb'

    // Font — Sentient to match portfolio, scale with viewport
    const baseFontSize = W < 600 ? 18 : W < 900 ? 22 : 26
    const fontSize = Math.round(baseFontSize)
    const fontFamily = 'Sentient, Georgia, serif'
    const measure = document.createElement('canvas').getContext('2d')!
    measure.font = `600 ${fontSize}px ${fontFamily}`

    const cx = W / 2
    const cy = H / 2

    // Load sketch (transparent PNG)
    const sketch = new Image()
    sketch.src = '/sketch.png'
    const imgW = W < 600 ? Math.min(140, W * 0.35) : Math.min(200, W * 0.2)
    const imgH = imgW * 1.2 // Slightly taller than wide for a seated figure
    const imgX = cx
    const imgY = cy

    // "welcome to the portfolio site of <CN/>"
    // Each word separate, arranged in an arc AROUND the sketch
    const r = Math.max(imgW, imgH) * 0.9

    const rawItems: Omit<TextItem, 'w' | 'h'>[] = [
      { label: 'welcome', x: imgX - r * 1.8, y: imgY - r * 1.2, angle: -0.12, isLink: false, href: null, fill: textColor },
      { label: 'to', x: imgX - r * 1.5, y: imgY - r * 0.5, angle: -0.20, isLink: false, href: null, fill: textColor },
      { label: 'the', x: imgX - r * 1.8, y: imgY + r * 0.1, angle: -0.28, isLink: false, href: null, fill: textColor },
      { label: 'portfolio', x: imgX - r * 1.6, y: imgY + r * 0.7, angle: -0.35, isLink: true, href: '__portfolio__', fill: linkColor },
      { label: 'site', x: imgX - r * 1.0, y: imgY + r * 1.2, angle: -0.38, isLink: false, href: null, fill: textColor },
      { label: 'of', x: imgX + r * 0.2, y: imgY + r * 1.3, angle: -0.25, isLink: false, href: null, fill: textColor },
      { label: '<CN/>', x: imgX + r * 1.0, y: imgY + r * 1.1, angle: -0.15, isLink: false, href: null, fill: linkColor, isBrand: true },
    ]

    const items: TextItem[] = rawItems.map((item) => {
      measure.font = item.isBrand ? `400 ${fontSize}px monospace` : `600 ${fontSize}px ${fontFamily}`
      const tw = measure.measureText(item.label).width
      return { ...item, w: Math.max(tw + 10, 20), h: Math.max(fontSize + 6, 20) }
    })

    // Engine
    const engine = Matter.Engine.create({ gravity: { y: GRAVITY } })
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // Walls — extra thick + ceiling to prevent escape
    const wall = (x: number, y: number, w: number, h: number) =>
      Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, restitution: 0.5 })
    Matter.Composite.add(engine.world, [
      wall(W / 2, H + WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),       // floor
      wall(W / 2, -WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),          // ceiling
      wall(-WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),          // left
      wall(W + WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),       // right
    ])

    // Sketch body — participates in physics
    const sketchBody = Matter.Bodies.rectangle(imgX, imgY, imgW * 0.8, imgH * 0.8, {
      restitution: RESTITUTION_IMG,
      friction: FRICTION_IMG,
      frictionAir: AIR_IMG,
      collisionFilter: { category: 0x0001, mask: 0x0001 },
    })
    Matter.Body.setStatic(sketchBody, true)
    ;(sketchBody as any)._isSketch = true
    Matter.Composite.add(engine.world, sketchBody)

    // Text bodies
    const textBodies = items.map((item) => {
      const b = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h, {
        restitution: RESTITUTION_TEXT,
        friction: FRICTION_TEXT,
        frictionAir: AIR_TEXT,
        angle: item.angle,
        collisionFilter: { category: 0x0001, mask: 0x0001 },
      })
      ;(b as any)._meta = item
      Matter.Body.setStatic(b, true)
      return b
    })
    Matter.Composite.add(engine.world, textBodies)

    const allBodies = [...textBodies, sketchBody]
    const linkBodies = textBodies.filter((b) => (b as any)._meta.isLink)

    const drop = (b: Matter.Body) => {
      Matter.Body.setStatic(b, false)
      Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 2, y: 0 })
      Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.05)
    }

    // Staggered timed drops — top body first via pendulum, then each subsequent body
    // drops after a short delay. No body gets stuck.
    const sorted = [...allBodies].sort((a, b) => a.position.y - b.position.y)
    const topBody = sorted[0]

    // Pendulum for top body
    setTimeout(() => {
      Matter.Body.setStatic(topBody, false)
      Matter.Body.setVelocity(topBody, { x: 0, y: 0 })

      const hx = (topBody.bounds.max.x - topBody.bounds.min.x) / 2
      const hy = (topBody.bounds.max.y - topBody.bounds.min.y) / 2

      const pendulum = Matter.Constraint.create({
        pointA: { x: topBody.position.x + hx, y: topBody.position.y - hy },
        bodyB: topBody,
        pointB: { x: hx, y: -hy },
        stiffness: 0.02,
        damping: 0.01,
        length: 0,
      })
      Matter.Composite.add(engine.world, pendulum)

      setTimeout(() => {
        Matter.Composite.remove(engine.world, pendulum)
        drop(topBody)
      }, PENDULUM_RELEASE)
    }, PENDULUM_DELAY)

    // Staggered drops for remaining bodies — collision OR timeout, whichever first
    const dropped = new Set<Matter.Body>([topBody])

    sorted.slice(1).forEach((body, i) => {
      // Each body drops after staggered delay (even without collision)
      setTimeout(() => {
        if (!dropped.has(body)) {
          dropped.add(body)
          drop(body)
        }
      }, PENDULUM_DELAY + 800 + i * 400)
    })

    // Also drop on collision (faster cascade if things collide)
    Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
      pairs.forEach(({ bodyA: a, bodyB: b }) => {
        if (!a.isStatic && b.isStatic && !dropped.has(b)) {
          dropped.add(b)
          drop(b)
        }
        if (!b.isStatic && a.isStatic && !dropped.has(a)) {
          dropped.add(a)
          drop(a)
        }
      })
    })

    // Clamp velocity to prevent bodies from escaping
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const maxSpeed = 15
      allBodies.forEach((b) => {
        if (b.isStatic) return
        const v = b.velocity
        const speed = Math.sqrt(v.x * v.x + v.y * v.y)
        if (speed > maxSpeed) {
          const scale = maxSpeed / speed
          Matter.Body.setVelocity(b, { x: v.x * scale, y: v.y * scale })
        }
        // Force back if somehow escaped
        if (b.position.x < -20) Matter.Body.setPosition(b, { x: 50, y: b.position.y })
        if (b.position.x > W + 20) Matter.Body.setPosition(b, { x: W - 50, y: b.position.y })
        if (b.position.y < -20) Matter.Body.setPosition(b, { x: b.position.x, y: 50 })
        if (b.position.y > H + 20) Matter.Body.setPosition(b, { x: b.position.x, y: H - 50 })
      })
    })

    // Mouse drag
    const mouse = Matter.Mouse.create(canvas)
    mouse.pixelRatio = dpr
    Matter.Composite.add(engine.world, Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    }))

    // Click detection
    let mouseDownPos = { x: 0, y: 0 }
    const hitTest = (b: Matter.Body, px: number, py: number) => {
      const meta = (b as any)._meta
      if (!meta) return false
      const dx = px - b.position.x
      const dy = py - b.position.y
      const cos = Math.cos(-b.angle)
      const sin = Math.sin(-b.angle)
      const lx = dx * cos - dy * sin
      const ly = dx * sin + dy * cos
      return Math.abs(lx) < meta.w / 2 + 5 && Math.abs(ly) < meta.h / 2 + 5
    }

    canvas.addEventListener('mousedown', (e) => { mouseDownPos = { x: e.clientX, y: e.clientY } })
    canvas.addEventListener('click', (e) => {
      const dx = e.clientX - mouseDownPos.x
      const dy = e.clientY - mouseDownPos.y
      if (dx * dx + dy * dy > 25) return
      const hit = linkBodies.find((b) => hitTest(b, e.clientX, e.clientY))
      if (hit) onEnter()
    })
    canvas.addEventListener('mousemove', (e) => {
      const hit = linkBodies.find((b) => hitTest(b, e.clientX, e.clientY))
      canvas.style.cursor = hit ? 'pointer' : 'default'
    })
    canvas.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0]
      if (!touch) return
      const hit = linkBodies.find((b) => hitTest(b, touch.clientX, touch.clientY))
      if (hit) onEnter()
    })

    // Render
    const underlineH = Math.max(fontSize * 0.08, 1.5)
    const underlineY = fontSize * 0.4

    let raf = 0
    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, W, H)

      // Draw sketch
      if (sketch.complete && sketch.naturalWidth > 0) {
        ctx.save()
        ctx.translate(sketchBody.position.x, sketchBody.position.y)
        ctx.rotate(sketchBody.angle)
        ctx.drawImage(sketch, -imgW / 2, -imgH / 2, imgW, imgH)
        ctx.restore()
      }

      // Draw text
      const time = performance.now() / 1000

      textBodies.forEach((body) => {
        const meta = (body as any)._meta as TextItem
        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)

        if (meta.isBrand) {
          // Animated <CN/>
          const pulse = 0.5 + 0.5 * Math.sin(time * 2)
          ctx.shadowColor = linkColor
          ctx.shadowBlur = 6 + pulse * 10

          // Brackets in lighter weight
          ctx.font = `400 ${fontSize}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = linkColor
          ctx.globalAlpha = 0.5 + pulse * 0.3
          
          const bracketW = ctx.measureText('<').width
          const cnMeasure = ctx.measureText('CN').width
          ctx.font = `700 ${fontSize}px monospace`
          const fullCN = ctx.measureText('CN').width
          
          // Draw as one centered string but with style variation
          ctx.font = `400 ${fontSize}px monospace`
          ctx.globalAlpha = 0.5 + pulse * 0.3
          ctx.fillText('<', -meta.w / 2 + bracketW / 2 + 2, 0)
          
          ctx.font = `700 ${fontSize}px monospace`
          ctx.globalAlpha = 0.8 + pulse * 0.2
          ctx.fillText('CN', -meta.w / 2 + bracketW + fullCN / 2 + 2, 0)
          
          ctx.font = `400 ${fontSize}px monospace`
          ctx.globalAlpha = 0.5 + pulse * 0.3
          ctx.fillText('/>', -meta.w / 2 + bracketW + fullCN + ctx.measureText('/>').width / 2 + 2, 0)
          
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1
        } else {
          ctx.font = `600 ${fontSize}px ${fontFamily}`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = meta.fill
          ctx.fillText(meta.label, 0, 0)
          if (meta.isLink) {
            ctx.fillRect(-meta.w / 2, underlineY, meta.w, underlineH)
          }
        }
        ctx.restore()
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onResize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', onResize)

    cleanupRef.current = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
    }
  }, [onEnter])

  useEffect(() => {
    // Wait for font to load
    document.fonts.ready.then(() => {
      setTimeout(setup, 100)
    })
    return () => { cleanupRef.current?.() }
  }, [setup])

  return (
    <div className="fixed inset-0 z-[90] bg-[var(--background)]">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
