'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Option C — Torus Knot Wireframe ─────────────────── */
function TorusKnotArt() {
  const groupRef = useRef<THREE.Group>(null)

  const edgesGeo = useMemo(() => {
    const knot = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16, 2, 3)
    return new THREE.EdgesGeometry(knot, 15)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * 0.12
      groupRef.current.rotation.y = t
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={1.1}>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.18} />
      </lineSegments>
    </group>
  )
}

/* ─── Floating Octahedron (section divider) ────────────── */
function FloatingOctahedron({ size = 0.6, speed = 0.2 }: { size?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null)

  const wireGeo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(size)
    return new THREE.EdgesGeometry(geo)
  }, [size])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
      ref.current.rotation.z += delta * speed * 0.5
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[size]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={wireGeo}>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
      </lineSegments>
    </group>
  )
}

/* ─── Grid Sphere (contact background) ─────────────────── */
function GridSphere() {
  const ref = useRef<THREE.LineSegments>(null)

  const wireGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.8, 24, 24)
    return new THREE.EdgesGeometry(geo, 1)
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <lineSegments ref={ref} geometry={wireGeo}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.12} />
    </lineSegments>
  )
}

/* ─── Canvas wrappers ──────────────────────────────────── */
function SceneWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pointer-events-none animate-fade-in ${className}`} style={{ animationDuration: '1s', animationFillMode: 'both' }}>
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
    <SceneWrapper className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-[70%] opacity-25 hidden lg:block">
      <TorusKnotArt />
    </SceneWrapper>
  )
}

export function SectionDivider() {
  return (
    <SceneWrapper className="w-full h-24 opacity-50">
      <FloatingOctahedron />
    </SceneWrapper>
  )
}

export function ContactArt() {
  return (
    <SceneWrapper className="absolute inset-0 opacity-30">
      <GridSphere />
    </SceneWrapper>
  )
}

