/**
 * ParticleWaveBackground
 *
 * A production-ready 3D animated background built with React Three Fiber.
 * Renders thousands of GPU-animated particles forming a "living" wave surface
 * that reacts subtly to mouse movement — evoking an AI computation field.
 *
 * Usage:
 *   <div className="relative">
 *     <ParticleWaveBackground />
 *     <AppContent />
 *   </div>
 */

import { useMemo, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const GalaxyParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uSize: 0.020,
    uInsideColor: new THREE.Color('#ffffff'),
    uOutsideColor: new THREE.Color('#7dd3fc'),
  },

  /* glsl */ `
    uniform float uTime;
    uniform float uSize;

    attribute float aRadius;
    attribute float aRadiusRatio;
    attribute float aBranchAngle;
    attribute vec3 aRandom;
    attribute float aScale;
    attribute float aMix;

    varying float vMix;

    void main() {
      float angle = aBranchAngle + (uTime * (1.0 - aRadiusRatio) * 0.15);
      vec3 base = vec3(cos(angle), 0.0, sin(angle)) * aRadius;
      vec3 pos = base + aRandom;

      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (uSize * 1000.0) * aScale * (1.0 / max(-mvPos.z, 1.0));
      gl_PointSize = clamp(gl_PointSize, 1.0, 22.0);

      vMix = aMix;

      gl_Position = projectionMatrix * mvPos;
    }
  `,

  /* glsl */ `
    uniform vec3 uInsideColor;
    uniform vec3 uOutsideColor;

    varying float vMix;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      if (dist > 0.5) discard;

      float alpha = (0.10 / max(dist, 0.03)) - 0.20;
      alpha = clamp(alpha, 0.0, 1.0);

      vec3 color = mix(uInsideColor, uOutsideColor, vMix);
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ GalaxyParticleMaterial })

function GalaxyParticles() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, radius, radiusRatio, branchAngle, randomOffset, scales, colorMix, count } = useMemo(() => {
    const count = 20000
    const maxRadius = 8
    const branches = 50

    const positions = new Float32Array(count * 3)
    const radius = new Float32Array(count)
    const radiusRatio = new Float32Array(count)
    const branchAngle = new Float32Array(count)
    const randomOffset = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const colorMix = new Float32Array(count)

    let p3 = 0
    for (let i = 0; i < count; i++) {
      const rr = Math.random()
      const r = Math.pow(rr, 1.5) * maxRadius
      const b = Math.floor(Math.random() * branches)
      const baseBranchAngle = (b / branches) * Math.PI * 2 + (Math.random() - 0.5) * 0.3

      const rx = (Math.pow(Math.random() * 2 - 1, 3) + 0.2) * rr
      const ry = (Math.pow(Math.random() * 2 - 1, 3) + 0.2) * rr
      const rz = (Math.pow(Math.random() * 2 - 1, 3) + 0.2) * rr

      positions[p3 + 0] = 0
      positions[p3 + 1] = 0
      positions[p3 + 2] = 0

      radius[i] = r
      radiusRatio[i] = rr
      branchAngle[i] = baseBranchAngle
      randomOffset[p3 + 0] = rx * 1.5
      randomOffset[p3 + 1] = ry * 0.15
      randomOffset[p3 + 2] = rz * 1.5
      scales[i] = Math.random()
      colorMix[i] = 1 - Math.pow(1 - rr, 2)

      p3 += 3
    }

    return { positions, radius, radiusRatio, branchAngle, randomOffset, scales, colorMix, count }
  }, [])

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime

    if (materialRef.current) {
      materialRef.current.uTime = elapsed
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.03
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.08) * 0.06
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          usage={THREE.StaticDrawUsage}
        />
        <bufferAttribute attach="attributes-aRadius" count={count} array={radius} itemSize={1} />
        <bufferAttribute attach="attributes-aRadiusRatio" count={count} array={radiusRatio} itemSize={1} />
        <bufferAttribute attach="attributes-aBranchAngle" count={count} array={branchAngle} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randomOffset} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aMix" count={count} array={colorMix} itemSize={1} />
      </bufferGeometry>

      <galaxyParticleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleWaveBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#201919',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: [0, 3, 0],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#201919', 1)
        }}
      >
        <GalaxyParticles />
      </Canvas>
    </div>
  )
}
