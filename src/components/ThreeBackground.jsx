import { Canvas, useFrame } from '@react-three/fiber'
import { Line, Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function FloatingParticles() {
  const pointsRef = useRef()
  const particles = useMemo(() => {
    const array = new Float32Array(1200)
    for (let i = 0; i < array.length; i += 3) {
      array[i] = (Math.random() - 0.5) * 16
      array[i + 1] = (Math.random() - 0.5) * 10
      array[i + 2] = (Math.random() - 0.5) * 10
    }
    return array
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03
      pointsRef.current.rotation.x += delta * 0.01
    }
  })

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled>
      <PointMaterial transparent color="#67e8f9" size={0.03} sizeAttenuation depthWrite={false} />
    </Points>
  )
}

function NeuralLines() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 20 }, () => [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6,
      ]),
    [],
  )

  const edges = useMemo(() => {
    const list = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = new THREE.Vector3(...nodes[i])
        const b = new THREE.Vector3(...nodes[j])
        if (a.distanceTo(b) < 2.8 && list.length < 28) {
          list.push([nodes[i], nodes[j]])
        }
      }
    }
    return list
  }, [nodes])

  return (
    <group>
      {edges.map((pair, index) => (
        <Line
          key={`edge-${index}`}
          points={pair}
          color="#818cf8"
          transparent
          opacity={0.35}
          lineWidth={0.8}
        />
      ))}
    </group>
  )
}

function Spheres() {
  const groupRef = useRef()

  useFrame(({ mouse }, delta) => {
    if (!groupRef.current) {
      return
    }
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.16, 0.03)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.x * 0.12, 0.03)
  })

  return (
    <group ref={groupRef}>
      {[[-2.2, 0.8, -1.8], [1.8, -1.4, -1.2], [0.5, 1.4, -2.7]].map((position, index) => (
        <mesh key={`sphere-${index}`} position={position}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#7c3aed" emissive="#38bdf8" emissiveIntensity={1.2} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 3]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-4, -2, 3]} intensity={1.1} color="#c084fc" />
      <FloatingParticles />
      <NeuralLines />
      <Spheres />
    </>
  )
}

function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-1 opacity-[0.85]">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
