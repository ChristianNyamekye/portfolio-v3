'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

const GRAVITY = 0.5
const PENDULUM_DELAY = 1750
const PENDULUM_RELEASE = 8000
const RESTITUTION_TEXT = 0.25
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

    // Snaking path around sketch — no overlaps, each word within collision reach of the next
    // Chain: welcome → to → the → portfolio → site → of → <CN/> → sketch
    const g = fontSize * 1.6
    const halfSketchW = imgW * 0.5
    const halfSketchH = imgH * 0.5

    const rawItems: Omit<TextItem, 'w' | 'h'>[] = [
      // 1. "welcome" — top-left, THE pendulum
      { label: 'welcome',   x: cx - g * 2.5, y: cy - halfSketchH - g * 2.5, angle: -0.12, isLink: false, href: null, fill: textColor },
      // 2. "to" — right of welcome, slightly lower
      { label: 'to',        x: cx - g * 0.2, y: cy - halfSketchH - g * 1.5, angle: 0.10,  isLink: false, href: null, fill: textColor },
      // 3. "the" — further right, dropping toward sketch
      { label: 'the',       x: cx + g * 1.8, y: cy - halfSketchH - g * 0.5, angle: 0.15,  isLink: false, href: null, fill: textColor },
      // 4. "portfolio" — right side of sketch. THE LINK.
      { label: 'portfolio', x: cx + halfSketchW + g * 1.5, y: cy - g * 0.2, angle: -0.08, isLink: true, href: '__portfolio__', fill: linkColor },
      // 5. "site" — below-right, curving under sketch
      { label: 'site',      x: cx + g * 1.5, y: cy + halfSketchH + g * 0.6, angle: -0.12, isLink: false, href: null, fill: textColor },
      // 6. "of" — below sketch, left side
      { label: 'of',        x: cx - g * 1.0, y: cy + halfSketchH + g * 1.2, angle: -0.10, isLink: false, href: null, fill: textColor },
      // 7. "<CN/>" — below-left, last word before sketch gets knocked
      { label: '<CN/>',     x: cx - g * 2.5, y: cy + halfSketchH + g * 0.3, angle: -0.05, isLink: false, href: null, fill: linkColor, isBrand: true },
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
    const wall = (x: number, y: number, w: number, h: number) => {
      const b = Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, restitution: 0.5 })
      ;(b as any)._isWall = true
      return b
    }
    Matter.Composite.add(engine.world, [
      wall(W / 2, H - 1 + WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),   // floor — flush with bottom
      wall(W / 2, -WALL_THICKNESS / 2, W * 3, WALL_THICKNESS),          // ceiling
      wall(-WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),          // left
      wall(W + WALL_THICKNESS / 2, H / 2, WALL_THICKNESS, H * 3),       // right
    ])

    // Everything on same collision layer — sketch is part of the domino chain
    const sketchBody = Matter.Bodies.rectangle(cx, cy, imgW * 0.8, imgH * 0.8, {
      restitution: RESTITUTION_IMG,
      friction: FRICTION_IMG,
      frictionAir: AIR_IMG,
    })
    Matter.Body.setStatic(sketchBody, true)
    ;(sketchBody as any)._isSketch = true
    Matter.Composite.add(engine.world, sketchBody)

    // Text bodies — all collide with each other
    const textBodies = items.map((item) => {
      const b = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h, {
        restitution: RESTITUTION_TEXT,
        friction: FRICTION_TEXT,
        frictionAir: AIR_TEXT,
        angle: item.angle,
        // No collision filter — everything collides with everything
      })
      ;(b as any)._meta = item
      Matter.Body.setStatic(b, true)
      return b
    })
    Matter.Composite.add(engine.world, textBodies)

    const allBodies = [...textBodies, sketchBody]
    const linkBodies = textBodies.filter((b) => (b as any)._meta.isLink)
    const wordBodies = textBodies.filter((b) => !(b as any)._meta.isLink)

    const drop = (b: Matter.Body) => {
      Matter.Body.setStatic(b, false)
      Matter.Body.setVelocity(b, { x: 0, y: 0 })
      Matter.Body.setAngularVelocity(b, 0)
    }

    // "welcome" is the pendulum — find it by label
    const contactBody = textBodies.find((b) => (b as any)._meta.label === 'welcome')!
    const staticBodies = new Set<Matter.Body>(allBodies.filter((b) => b !== contactBody))

    // Contact body starts active — propagates cascade on collision
    ;(contactBody as any)._isActive = true

    setTimeout(() => {
      Matter.Body.setStatic(contactBody, false)
      Matter.Body.setVelocity(contactBody, { x: 0, y: 0 })

      const hx = (contactBody.bounds.max.x - contactBody.bounds.min.x) / 2
      const hy = (contactBody.bounds.max.y - contactBody.bounds.min.y) / 2

      // Pivot from top-right corner — zero-length constraint, swings naturally
      const pendulum = Matter.Constraint.create({
        pointA: { x: contactBody.position.x + hx, y: contactBody.position.y - hy },
        bodyB: contactBody,
        pointB: { x: hx, y: -hy },
        stiffness: 0.02,
        damping: 0.01,
        length: 0,
      })
      Matter.Composite.add(engine.world, pendulum)
      Matter.Body.setVelocity(contactBody, { x: 0, y: 0 })

      // Release pendulum after 8s — word falls freely
      setTimeout(() => {
        Matter.Composite.remove(engine.world, pendulum)
        drop(contactBody)
      }, 8000)
    }, 1250)

    // Collision cascade — active bodies activate static bodies on contact
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

    // No velocity clamping — let physics run naturally like Rene's

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
