import { useEffect, useRef } from 'react'

const BASE_COLOR = '#05070d'
const ELECTRIC_BLUE = '#00d4ff'
const NEON_CYAN = '#66f4ff'
const DEEP_VIOLET = '#7a5cff'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function createNodeSet(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random(),
    vx: (Math.random() - 0.5) * 0.00035,
    vy: (Math.random() - 0.5) * 0.00035,
    pulse: Math.random() * Math.PI * 2,
    size: 1.5 + Math.random() * 2.2,
    layerShift: (Math.random() - 0.5) * 0.3,
  }))
}

function getAdaptiveNodeCount(width, height) {
  const area = width * height
  const isMobile = width < 768
  const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4
  const base = Math.floor(area / (isMobile ? 18000 : 13000))
  const memoryFactor = deviceMemory <= 4 ? 0.85 : 1
  const target = Math.floor(base * memoryFactor)
  return clamp(target, isMobile ? 34 : 70, isMobile ? 78 : 155)
}

function NeuralGridBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) {
      return undefined
    }

    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let lastTime = performance.now()
    let phase = 0

    const mouse = {
      x: 0,
      y: 0,
      nx: 0,
      ny: 0,
      active: false,
    }

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = createNodeSet(getAdaptiveNodeCount(width, height))
    }

    const onMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      mouse.nx = (event.clientX / width) * 2 - 1
      mouse.ny = (event.clientY / height) * 2 - 1
      mouse.active = true
    }

    const onMouseLeave = () => {
      mouse.active = false
    }

    const projectNode = (node, driftX, driftY) => {
      const depth = 0.35 + node.z * 1.65
      const perspective = 0.42 + node.z * 1.25
      const parallaxStrength = (node.z - 0.2) * 0.05

      const px =
        width * 0.5 +
        (node.x + driftX + (mouse.active ? mouse.nx * parallaxStrength : 0)) * width * 0.55 * perspective
      const py =
        height * 0.52 +
        (node.y + driftY + (mouse.active ? mouse.ny * parallaxStrength : 0)) * height * 0.55 * perspective

      return { x: px, y: py, depth, perspective }
    }

    const drawGrid = (time) => {
      const cx = width * 0.5
      const cy = height * 0.56
      const timeShift = (time * 0.00002) % 1
      const rotation = Math.sin(time * 0.00008) * 0.06 + (mouse.active ? mouse.nx * 0.025 : 0)

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)

      const verticalCount = width < 768 ? 9 : 14
      const depthLines = width < 768 ? 18 : 28

      for (let i = 0; i < depthLines; i += 1) {
        const z = ((i / depthLines + timeShift) % 1) + 0.001
        const depth = 1 - z
        const y = depth * depth * height * 0.95
        const alpha = clamp((1 - z) * 0.3, 0.02, 0.26)
        const lineWidth = 0.5 + (1 - z) * 0.8

        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(-width, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      for (let i = -verticalCount; i <= verticalCount; i += 1) {
        const lane = i / verticalCount
        const startX = lane * width * 0.95
        const endX = lane * width * 0.2
        const alpha = clamp(0.08 + (1 - Math.abs(lane)) * 0.2, 0.06, 0.24)

        ctx.strokeStyle = `rgba(102, 244, 255, ${alpha})`
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(startX, height * 0.9)
        ctx.lineTo(endX, 0)
        ctx.stroke()
      }

      ctx.restore()
    }

    const render = (now) => {
      const dt = clamp((now - lastTime) / 16.67, 0.5, 2)
      lastTime = now
      phase += reducedMotion ? 0.0005 : 0.0022 * dt

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#060a14')
      gradient.addColorStop(0.55, BASE_COLOR)
      gradient.addColorStop(1, '#04060b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      drawGrid(now)

      const rendered = []
      const nodeInfluenceRadius = Math.min(width, height) * 0.18
      const cursorLinkRadius = Math.min(width, height) * 0.22
      const driftX = Math.sin(phase * 0.8) * 0.007
      const driftY = Math.cos(phase * 0.65) * 0.007

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        node.x += node.vx * dt
        node.y += node.vy * dt
        if (Math.abs(node.x) > 1.12) node.vx *= -1
        if (Math.abs(node.y) > 1.12) node.vy *= -1

        const wave = Math.sin(phase * 1.8 + node.pulse) * 0.004
        const projected = projectNode(node, driftX + node.layerShift * 0.01, driftY + wave)
        const dx = mouse.x - projected.x
        const dy = mouse.y - projected.y
        const distToCursor = Math.hypot(dx, dy)
        const cursorEnergy = mouse.active ? clamp(1 - distToCursor / nodeInfluenceRadius, 0, 1) : 0
        const baseAlpha = clamp(0.22 + node.z * 0.52, 0.2, 0.8)
        const pulse = 0.35 + (Math.sin(phase * 3 + node.pulse) * 0.5 + 0.5) * 0.65
        const alpha = clamp(baseAlpha * (0.75 + pulse * 0.35) + cursorEnergy * 0.45, 0.1, 1)

        const radius = node.size * projected.perspective * (1 + cursorEnergy * 0.32)
        const blur = 8 + node.z * 14 + cursorEnergy * 18

        const coreColor = node.z > 0.66 ? NEON_CYAN : node.z > 0.4 ? ELECTRIC_BLUE : DEEP_VIOLET
        ctx.shadowBlur = blur
        ctx.shadowColor = coreColor
        ctx.fillStyle = `${coreColor}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2)
        ctx.fill()

        rendered.push({
          x: projected.x,
          y: projected.y,
          z: node.z,
          alpha,
          cursorEnergy,
          distToCursor,
        })
      }

      ctx.shadowBlur = 0

      const maxDistance = width < 768 ? 115 : 150
      const maxDistanceSq = maxDistance * maxDistance

      for (let i = 0; i < rendered.length; i += 1) {
        let localLinks = 0
        for (let j = i + 1; j < rendered.length; j += 1) {
          if (localLinks > 4) {
            break
          }

          const a = rendered[i]
          const b = rendered[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq > maxDistanceSq) {
            continue
          }

          const proximity = 1 - distSq / maxDistanceSq
          const depthBlend = (a.z + b.z) * 0.5
          const energyBoost = Math.max(a.cursorEnergy, b.cursorEnergy)
          const opacity = clamp(0.03 + proximity * 0.2 + depthBlend * 0.08 + energyBoost * 0.28, 0.03, 0.4)

          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`
          ctx.lineWidth = 0.5 + depthBlend * 0.7 + energyBoost * 0.4
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()

          localLinks += 1
        }
      }

      if (mouse.active) {
        for (let i = 0; i < rendered.length; i += 1) {
          const node = rendered[i]
          if (node.distToCursor > cursorLinkRadius) {
            continue
          }
          const strength = 1 - node.distToCursor / cursorLinkRadius
          ctx.strokeStyle = `rgba(122, 92, 255, ${clamp(0.05 + strength * 0.35, 0.05, 0.4)})`
          ctx.lineWidth = 0.4 + strength * 0.8
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      rafId = window.requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    rafId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      aria-hidden="true"
    />
  )
}

export default NeuralGridBackground
