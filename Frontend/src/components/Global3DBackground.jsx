import { memo, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function EnergySurface({ isMobile }) {
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const shaderRef = useRef(null)

  const segmentX = isMobile ? 36 : 76
  const segmentY = isMobile ? 22 : 48

  const materialProps = useMemo(() => ({
    color: '#06b6d4',
    emissive: '#00d4ff',
    emissiveIntensity: 0.34,
    transparent: true,
    opacity: 0.44,
    wireframe: true,
    metalness: 0.2,
    roughness: 0.6,
  }), [])

  useFrame((state, delta) => {
    if (shaderRef.current?.uniforms?.uTime) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -0.35, 0.7]} rotation={[-1.08, 0.28, 0.05]}>
      <planeGeometry args={[22, 16, segmentX, segmentY]} />
      <meshStandardMaterial
        ref={materialRef}
        {...materialProps}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 }

          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              `#include <common>\nuniform float uTime;`,
            )
            .replace(
              '#include <begin_vertex>',
              `
                #include <begin_vertex>
                float wave = sin(position.x * 2.0 + uTime) * 0.2 + cos(position.y * 2.0 + uTime) * 0.2;
                transformed.z += wave;
              `,
            )

          shaderRef.current = shader
        }}
      />
    </mesh>
  )
}

function Global3DBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="global-3d-background" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        shadows={false}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.35, 4.9], fov: 48, near: 0.1, far: 100, rotation: [-0.12, 0, 0] }}
        onCreated={({ gl }) => {
          gl.setClearColor('#05070D', 1)
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 4, 3]} intensity={0.62} />
        <EnergySurface isMobile={isMobile} />
      </Canvas>
    </div>
  )
}

export default memo(Global3DBackground)
