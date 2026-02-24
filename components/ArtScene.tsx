'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Mouse-reactive Torus Knot ────────────────────────── */
function InteractiveTorusKnot() {
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  const edgesGeo = useMemo(() => {
    const knot = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16, 2, 3)
    return new THREE.EdgesGeometry(knot, 15)
  }, [])

  // Track mouse globally
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime * 0.1

    // Smooth mouse follow
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.03

    // Base rotation + mouse influence
    groupRef.current.rotation.y = t + smoothMouse.current.x * 0.5
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.1 + smoothMouse.current.y * 0.3
  })

  return (
    <group ref={groupRef} scale={1.1}>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.2} />
      </lineSegments>
      {/* Subtle inner glow mesh */}
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 64, 8, 2, 3]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.02} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ─── Canvas wrapper ───────────────────────────────────── */
function SceneWrapper({ children, className = '', interactive = false }: { children: React.ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div className={`${interactive ? 'pointer-events-auto' : 'pointer-events-none'} animate-fade-in ${className}`} style={{ animationDuration: '1s', animationFillMode: 'both' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.3} />
        {children}
      </Canvas>
    </div>
  )
}

export function HeroArt() {
  return (
    <SceneWrapper
      interactive
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[80%] opacity-30 hidden lg:block"
    >
      <InteractiveTorusKnot />
    </SceneWrapper>
  )
}
