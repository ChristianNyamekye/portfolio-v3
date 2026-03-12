'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

const GRAVITY = 0.25
const PENDULUM_DELAY = 1250
const PENDULUM_RELEASE = 8000
const RESTITUTION_TEXT = 0.15
const RESTITUTION_IMG = 0.3
const FRICTION_TEXT = 0.3
const FRICTION_IMG = 0.5
const AIR_TEXT = 0.01
const AIR_IMG = 0.02
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

    // Domino layout — each item positioned so it will be hit by the one above.
    // "welcome" swings on pendulum → hits "to" → hits "the" → ... → sketch last
    const step = fontSize * 1.6  // vertical gap — close enough for domino contact

    const rawItems: Omit<TextItem, 'w' | 'h'>[] = [
      // Pendulum word (topmost)
      { label: 'welcome',   x: cx - step * 0.5, y: cy - step * 3,    angle: -0.10, isLink: false, href: null, fill: textColor },
      // Each one slightly offset horizontally for the arc, but vertically stacked for domino
      { label: 'to',        x: cx - step * 0.8, y: cy - step * 2,    angle: -0.18, isLink: false, href: null, fill: textColor },
      { label: 'the',       x: cx - step * 1.0, y: cy - step * 1,    angle: -0.25, isLink: false, href: null, fill: textColor },
      { label: 'portfolio', x: cx - step * 0.7, y: cy,                angle: -0.30, isLink: true, href: '__portfolio__', fill: linkColor },
      { label: 'site',      x: cx - step * 0.3, y: cy + step * 1,    angle: -0.22, isLink: false, href: null, fill: textColor },
      { label: 'of',        x: cx + step * 0.2, y: cy + step * 1.8,  angle: -0.15, isLink: false, href: null, fill: textColor },
      { label: '<CN/>',     x: cx + step * 0.6, y: cy + step * 2.5,  angle: -0.08, isLink: false, href: null, fill: linkColor, isBrand: true },
    ]

    const items: TextItem[] = rawItems.map((item) => {
      measure.font = item.isBrand ? `400 ${fontSize}px monospace` : `600 ${fontSize}px ${fontFamily}`
      const tw = measure.measureText(item.label).width
      return { ...item, w: Math.max(tw + 10, 20), h: Math.max(fontSize + 6, 20) }
    })

    // Engine
    const engine = Matter.Engine.create({ gravity: { y: GRAVITY }, enableSleeping: true })
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    // Walls — extra thick + ceiling to prevent escape
    const wall = (x: number, y: number, w: number, h: number) =>
      Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, restitution: 0.5 })
    Matter.Composite.add(engine.world, [
      wall(W / 2, H - 1 + WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),   // floor — flush with bottom
      wall(W / 2, -WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),          // ceiling
      wall(-WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),          // left
      wall(W + WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),       // right
    ])

    // Sketch body — participates in physics
    // Sketch at the end of the domino chain
    const sketchBody = Matter.Bodies.rectangle(cx + step * 0.8, cy + step * 3.3, imgW * 0.8, imgH * 0.8, {
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
      Matter.Sleeping.set(b, false)
      Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 2, y: 0.5 })
      Matter.Body.setAngularVelocity(b, 0)
    }

    // Rene-style: top word swings on a pendulum, then releases and
    // knocks into other words via collision cascade.
    const sorted = [...allBodies].sort((a, b) => a.position.y - b.position.y)
    const topBody = sorted[0]
    const staticBodies = new Set<Matter.Body>(sorted.slice(1))

    // Mark all bodies so collision cascade can propagate
    ;(topBody as any)._isActive = true

    // Pendulum — top word starts swinging after 1.2s
    setTimeout(() => {
      Matter.Body.setStatic(topBody, false)
      Matter.Sleeping.set(topBody, false)
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

      // Release pendulum after 6s — word falls freely
      setTimeout(() => {
        Matter.Composite.remove(engine.world, pendulum)
        Matter.Body.setVelocity(topBody, { x: (Math.random() - 0.5) * 3, y: 1 })
      }, 6000)
    }, 1200)

    // Collision cascade — when a moving body hits a static one, the static one drops
    Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
      pairs.forEach(({ bodyA: a, bodyB: b }) => {
        if ((a as any)._isActive && !a.isStatic && staticBodies.has(b)) {
          staticBodies.delete(b)
          ;(b as any)._isActive = true
          Matter.Body.setStatic(b, false)
          Matter.Sleeping.set(b, false)
          Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 2, y: 0.5 })
        }
        if ((b as any)._isActive && !b.isStatic && staticBodies.has(a)) {
          staticBodies.delete(a)
          ;(a as any)._isActive = true
          Matter.Body.setStatic(a, false)
          Matter.Sleeping.set(a, false)
          Matter.Body.setVelocity(a, { x: (Math.random() - 0.5) * 2, y: 0.5 })
        }
      })
    })

    // No safety net needed — domino layout guarantees full cascade

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
          // <CN/> — clean monospace, brackets dimmer, no glow effects
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = linkColor
          ctx.font = `600 ${fontSize}px ${fontFamily}`
          ctx.fillText('<CN/>', 0, 0)
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
