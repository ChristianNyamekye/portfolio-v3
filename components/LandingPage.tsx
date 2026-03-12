'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

const GRAVITY = 0.25
const PENDULUM_DELAY = 1250
const PENDULUM_RELEASE = 8000
const FONT_SIZE = 28
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
  const engineRef = useRef<Matter.Engine | null>(null)
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

    // Detect dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const bgColor = isDark ? '#111111' : '#f7f5f2'
    const textColor = isDark ? '#e8e6e3' : '#000000'
    const linkColor = isDark ? '#5b8def' : '#2563eb'
    const mutedColor = isDark ? '#6b6b6b' : '#8a8a8a'

    // Measure text
    const measure = document.createElement('canvas').getContext('2d')!
    const fontSize = Math.round(FONT_SIZE * Math.min(W / 1400, 1))
    const smallSize = Math.round(fontSize * 0.5)
    measure.font = `500 ${fontSize}px Sentient, Georgia, serif`

    // Layout — text items positioned relative to center
    const cx = W / 2
    const cy = H / 2

    // Load headshot
    const headshot = new Image()
    headshot.src = '/headshot.jpg'
    const imgW = Math.min(180, W * 0.25)
    const imgH = imgW
    const imgX = cx
    const imgY = cy + fontSize * 2.5

    const rawItems: Omit<TextItem, 'w' | 'h'>[] = [
      // Bio text — arranged in an arc like Rene
      { label: 'CHRISTIAN', x: cx - fontSize * 5, y: cy + fontSize * 2, angle: -0.18, isLink: false, href: null, fill: textColor },
      { label: 'NYAMEKYE', x: cx - fontSize * 3.2, y: cy + fontSize * 1.2, angle: -0.38, isLink: false, href: null, fill: textColor },
      { label: 'IS AN', x: cx - fontSize * 1.8, y: cy + fontSize * 1.8, angle: -0.43, isLink: false, href: null, fill: textColor },
      { label: 'ENGINEER', x: cx - fontSize * 0.5, y: cy + fontSize * 0.5, angle: -0.66, isLink: false, href: null, fill: textColor },
      { label: '& BUILDER', x: cx + fontSize * 3, y: cy - fontSize * 0.8, angle: -0.46, isLink: false, href: null, fill: textColor },
      { label: 'BASED IN', x: cx + fontSize * 5, y: cy - fontSize * 0.2, angle: -0.27, isLink: false, href: null, fill: textColor },
      { label: 'NEW YORK.', x: cx + fontSize * 7, y: cy - fontSize * 0.5, angle: -0.11, isLink: false, href: null, fill: textColor },

      // Links — stacked above, slightly rotated
      { label: 'CONTACT', x: cx + fontSize * 1, y: cy - fontSize * 5.5, angle: -0.14, isLink: true, href: 'mailto:christian.k.nyamekye.26@dartmouth.edu', fill: linkColor },
      { label: 'PORTFOLIO', x: cx + fontSize * 0.5, y: cy - fontSize * 4, angle: -0.30, isLink: true, href: '__portfolio__', fill: linkColor },
      { label: 'GITHUB', x: cx - fontSize * 1, y: cy - fontSize * 2.5, angle: -0.03, isLink: true, href: 'https://github.com/ChristianNyamekye', fill: linkColor },
      { label: 'LINKEDIN', x: cx - fontSize * 2, y: cy - fontSize * 1.5, angle: 0.09, isLink: true, href: 'https://linkedin.com/in/christiannyamekye', fill: linkColor },
      { label: 'RESUME', x: cx - fontSize * 3.5, y: cy - fontSize * 0.5, angle: -0.10, isLink: true, href: 'https://docs.google.com/document/d/1baFxz880bwpHy8L0S91R3N1W0Ou0C3GJbxlDbjYw9Yo/edit?tab=t.0', fill: linkColor },
    ]

    // Measure widths
    const items: TextItem[] = rawItems.map((item) => {
      measure.font = `700 ${fontSize}px Helvetica, Arial, sans-serif`
      const tw = measure.measureText(item.label).width
      return { ...item, w: Math.max(tw, 20), h: Math.max(fontSize, 20) }
    })

    // Engine
    const engine = Matter.Engine.create({ gravity: { y: GRAVITY } })
    engineRef.current = engine
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

    // Photo body
    const photoBody = Matter.Bodies.rectangle(imgX, imgY, imgW, imgH, {
      restitution: RESTITUTION_IMG,
      friction: FRICTION_IMG,
      frictionAir: AIR_IMG,
      collisionFilter: { category: 0x0002, mask: 0x0001 },
    })
    Matter.Body.setStatic(photoBody, true)
    Matter.Composite.add(engine.world, photoBody)

    // Text bodies
    const bodies = items.map((item) => {
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
    Matter.Composite.add(engine.world, bodies)

    const linkBodies = bodies.filter((b) => (b as any)._meta.isLink)
    const wordBodies = bodies.filter((b) => !(b as any)._meta.isLink)

    const drop = (b: Matter.Body, scatter = false) => {
      Matter.Body.setStatic(b, false)
      Matter.Body.setVelocity(b, { x: scatter ? (Math.random() - 0.5) * 3 : 0, y: 0 })
      Matter.Body.setAngularVelocity(b, 0)
    }

    // Cascade — top link drops first, collisions activate the rest
    const sortedLinks = [...linkBodies].sort((a, b) => a.position.y - b.position.y)
    const topLink = sortedLinks[0]
    const staticBodies = new Set<Matter.Body>([...wordBodies, ...sortedLinks.slice(1)])
    linkBodies.forEach((b) => { (b as any)._isActive = true })

    // Pendulum for top link
    setTimeout(() => {
      Matter.Body.setStatic(topLink, false)
      Matter.Body.setVelocity(topLink, { x: 0, y: 0 })

      const hx = (topLink.bounds.max.x - topLink.bounds.min.x) / 2
      const hy = (topLink.bounds.max.y - topLink.bounds.min.y) / 2

      const pendulum = Matter.Constraint.create({
        pointA: { x: topLink.position.x + hx, y: topLink.position.y - hy },
        bodyB: topLink,
        pointB: { x: hx, y: -hy },
        stiffness: 0.02,
        damping: 0.01,
        length: 0,
      })
      Matter.Composite.add(engine.world, pendulum)

      setTimeout(() => {
        Matter.Composite.remove(engine.world, pendulum)
        drop(topLink)
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

    // Mouse interaction
    const mouse = Matter.Mouse.create(canvas)
    mouse.pixelRatio = dpr
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Matter.Composite.add(engine.world, mouseConstraint)

    // Click detection
    let mouseDownPos = { x: 0, y: 0 }
    const hitTest = (b: Matter.Body, cx: number, cy: number) => {
      const dx = cx - b.position.x
      const dy = cy - b.position.y
      const cos = Math.cos(-b.angle)
      const sin = Math.sin(-b.angle)
      const lx = dx * cos - dy * sin
      const ly = dx * sin + dy * cos
      return Math.abs(lx) < (b as any)._meta.w / 2 + 5 && Math.abs(ly) < (b as any)._meta.h / 2 + 5
    }

    canvas.addEventListener('mousedown', (e) => {
      mouseDownPos = { x: e.clientX, y: e.clientY }
    })

    canvas.addEventListener('click', (e) => {
      const dx = e.clientX - mouseDownPos.x
      const dy = e.clientY - mouseDownPos.y
      if (dx * dx + dy * dy > 25) return
      const hit = linkBodies.find((b) => hitTest(b, e.clientX, e.clientY))
      if (hit) {
        const href = (hit as any)._meta.href
        if (href === '__portfolio__') {
          onEnter()
        } else {
          window.open(href, '_blank')
        }
      }
    })

    canvas.addEventListener('mousemove', (e) => {
      const hit = linkBodies.find((b) => hitTest(b, e.clientX, e.clientY))
      canvas.style.cursor = hit ? 'pointer' : 'default'
    })

    // Render loop
    const underlineH = fontSize * 0.1
    const underlineY = fontSize * 0.45

    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, W, H)

      // Draw headshot
      if (headshot.complete) {
        ctx.save()
        ctx.translate(photoBody.position.x, photoBody.position.y)
        ctx.rotate(photoBody.angle)
        ctx.globalAlpha = 0.08
        ctx.beginPath()
        ctx.arc(0, 0, imgW / 2, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(headshot, -imgW / 2, -imgH / 2, imgW, imgH)
        ctx.restore()
      }

      // Draw text bodies
      ctx.font = `700 ${fontSize}px Helvetica, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      bodies.forEach((body) => {
        const meta = (body as any)._meta as TextItem
        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)
        ctx.fillStyle = meta.fill
        ctx.fillText(meta.label, 0, 0)

        // Underline for links
        if (meta.isLink) {
          ctx.fillStyle = meta.fill
          ctx.fillRect(-meta.w / 2, underlineY, meta.w, underlineH)
        }

        ctx.restore()
      })

      // Hint text at bottom
      ctx.font = `400 ${smallSize}px Sentient, Georgia, serif`
      ctx.fillStyle = mutedColor
      ctx.textAlign = 'center'
      ctx.fillText('drag to rearrange · click portfolio to enter', W / 2, H - 20)

      requestAnimationFrame(loop)
    }

    const raf = requestAnimationFrame(loop)

    // Resize handler
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
    // Small delay to ensure fonts are loaded
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
