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
const WALL_THICKNESS = 50

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

    // Font — scale with viewport, mobile-friendly
    const baseFontSize = W < 600 ? 22 : W < 900 ? 26 : 28
    const fontSize = Math.round(baseFontSize * Math.min(W / 1400, 1.2))
    const measure = document.createElement('canvas').getContext('2d')!
    measure.font = `700 ${fontSize}px Helvetica, Arial, sans-serif`

    const cx = W / 2
    const cy = H / 2

    // Load sketch (transparent PNG)
    const sketch = new Image()
    sketch.src = '/sketch.png'
    const imgW = W < 600 ? Math.min(160, W * 0.4) : Math.min(240, W * 0.25)
    const imgH = imgW

    // Text items: "WELCOME TO MY PORTFOLIO" — each word separate, PORTFOLIO is link
    // Arranged scattered like Rene's style
    const spacing = fontSize * 1.8
    const rawItems: Omit<TextItem, 'w' | 'h'>[] = [
      { label: 'WELCOME', x: cx - spacing * 1.2, y: cy - spacing * 1.5, angle: -0.12, isLink: false, href: null, fill: textColor },
      { label: 'TO', x: cx - spacing * 0.3, y: cy - spacing * 0.8, angle: -0.20, isLink: false, href: null, fill: textColor },
      { label: 'MY', x: cx + spacing * 0.4, y: cy - spacing * 0.3, angle: -0.30, isLink: false, href: null, fill: textColor },
      { label: 'PORTFOLIO', x: cx + spacing * 0.2, y: cy + spacing * 0.4, angle: -0.18, isLink: true, href: '__portfolio__', fill: linkColor },
    ]

    const items: TextItem[] = rawItems.map((item) => {
      const tw = measure.measureText(item.label).width
      return { ...item, w: Math.max(tw, 20), h: Math.max(fontSize, 20) }
    })

    // Engine
    const engine = Matter.Engine.create({ gravity: { y: GRAVITY } })
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // Walls
    const wall = (x: number, y: number, w: number, h: number) =>
      Matter.Bodies.rectangle(x, y, w, h, { isStatic: true })
    Matter.Composite.add(engine.world, [
      wall(W / 2, H + WALL_THICKNESS / 2, W * 2, WALL_THICKNESS),
      wall(W / 2, -WALL_THICKNESS / 2, W * 2, WALL_THICKNESS),
      wall(-WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 2),
      wall(W + WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 2),
    ])

    // Sketch body — participates in physics (falls too)
    const sketchBody = Matter.Bodies.rectangle(cx, cy + spacing * 1.5, imgW, imgH, {
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

    // All physics bodies (text + sketch)
    const allBodies = [...textBodies, sketchBody]
    const linkBodies = textBodies.filter((b) => (b as any)._meta.isLink)

    const drop = (b: Matter.Body) => {
      Matter.Body.setStatic(b, false)
      Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 3, y: 0 })
      Matter.Body.setAngularVelocity(b, 0)
    }

    // Cascade — top element drops first, collisions activate the rest
    const sorted = [...allBodies].sort((a, b) => a.position.y - b.position.y)
    const topBody = sorted[0]
    const staticBodies = new Set<Matter.Body>(sorted.slice(1))
    ;(topBody as any)._isActive = true
    // Mark all link bodies as active so they can trigger cascades
    linkBodies.forEach((b) => { (b as any)._isActive = true })

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

    // Collision cascade
    Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
      pairs.forEach(({ bodyA: a, bodyB: b }) => {
        if ((a as any)._isActive && !a.isStatic && staticBodies.has(b)) {
          staticBodies.delete(b)
          ;(b as any)._isActive = true
          drop(b)
        }
        if ((b as any)._isActive && !b.isStatic && staticBodies.has(a)) {
          staticBodies.delete(a)
          ;(a as any)._isActive = true
          drop(a)
        }
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

    canvas.addEventListener('mousedown', (e) => {
      mouseDownPos = { x: e.clientX, y: e.clientY }
    })
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

    // Touch support for mobile
    canvas.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0]
      if (!touch) return
      const hit = linkBodies.find((b) => hitTest(b, touch.clientX, touch.clientY))
      if (hit) onEnter()
    })

    // Render loop
    const underlineH = fontSize * 0.1
    const underlineY = fontSize * 0.45

    let raf = 0
    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, W, H)

      // Draw sketch (with physics)
      if (sketch.complete && sketch.naturalWidth > 0) {
        ctx.save()
        ctx.translate(sketchBody.position.x, sketchBody.position.y)
        ctx.rotate(sketchBody.angle)
        ctx.drawImage(sketch, -imgW / 2, -imgH / 2, imgW, imgH)
        ctx.restore()
      }

      // Draw text
      ctx.font = `700 ${fontSize}px Helvetica, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      textBodies.forEach((body) => {
        const meta = (body as any)._meta as TextItem
        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)
        ctx.fillStyle = meta.fill
        ctx.fillText(meta.label, 0, 0)
        if (meta.isLink) {
          ctx.fillRect(-meta.w / 2, underlineY, meta.w, underlineH)
        }
        ctx.restore()
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Resize
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
    const timer = setTimeout(setup, 200)
    return () => {
      clearTimeout(timer)
      cleanupRef.current?.()
    }
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
