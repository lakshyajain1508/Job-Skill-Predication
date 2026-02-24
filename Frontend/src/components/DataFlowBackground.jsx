/**
 * DataFlowBackground.jsx
 *
 * Futuristic pseudo-3D data-flow lines animated canvas background.
 * Simulates a real-time AI data-engine running behind the interface.
 *
 * Stack: React + HTML5 Canvas + GSAP + rAF (no Three.js / heavy libs)
 *
 * Usage:
 *   <div className="relative">
 *     <DataFlowBackground />
 *     <AppContent />
 *   </div>
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ─── Constants ────────────────────────────────────────────────────────────────

const BG_COLOR = '#05070D';

const PALETTE = [
  { r: 0,   g: 212, b: 255, name: 'electricBlue'  }, // #00D4FF
  { r: 0,   g: 255, b: 236, name: 'neonCyan'       }, // #00FFEC
  { r: 155, g: 89,  b: 255, name: 'softViolet'     }, // #9B59FF
  { r: 0,   g: 180, b: 255, name: 'deepBlue'       }, // #00B4FF
];

// Depth layer definitions — processed back-to-front (painter's algorithm)
const LAYER_DEFS = [
  {
    id: 'bg',
    speedScale:    0.28,
    opacityScale:  0.18,
    sizeScale:     0.45,
    blur:          2.5,
    parallaxFactor: 0.008,
    lineCount:     { desktop: 8,  mobile: 4  },
    particleCount: { desktop: 12, mobile: 5  },
  },
  {
    id: 'mid',
    speedScale:    0.65,
    opacityScale:  0.38,
    sizeScale:     0.72,
    blur:          0.8,
    parallaxFactor: 0.022,
    lineCount:     { desktop: 10, mobile: 5  },
    particleCount: { desktop: 18, mobile: 7  },
  },
  {
    id: 'fg',
    speedScale:    1.30,
    opacityScale:  0.72,
    sizeScale:     1.00,
    blur:          0,
    parallaxFactor: 0.046,
    lineCount:     { desktop: 7,  mobile: 3  },
    particleCount: { desktop: 14, mobile: 6  },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp   = (a, b, t) => a + (b - a) * t;
const rand   = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pickColor = () => PALETTE[randInt(0, PALETTE.length - 1)];

const toRgba = ({ r, g, b }, alpha) => `rgba(${r},${g},${b},${alpha.toFixed(3)})`;

// Build a CSS hex string from a palette entry
const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

// ─── Factory functions ────────────────────────────────────────────────────────

function createLine(layer, canvasW, canvasH, isMobile) {
  const col        = pickColor();
  const baseSpeed  = rand(0.4, 1.1) * layer.speedScale * (isMobile ? 0.7 : 1);
  const baseOpacity = rand(0.5, 1.0) * layer.opacityScale;
  const lineWidth  = rand(0.4, 1.6) * layer.sizeScale;
  const glowSize   = rand(3, 9) * layer.sizeScale;

  // Subtle sinusoidal vertical drift
  const waveAmplitude = rand(2, 18) * layer.sizeScale;
  const waveFreq      = rand(0.0003, 0.0012);
  const wavePhase     = rand(0, Math.PI * 2);

  // Segment / dash style — gives the "data stream" look
  const segmentLen    = rand(40, 180) * layer.sizeScale;
  const gapLen        = rand(20, 120)  * layer.sizeScale;

  return {
    layer,
    col,
    hexCol:       toHex(col),
    baseY:        rand(0, canvasH),
    y:            0,                 // computed each frame
    speed:        baseSpeed,
    opacity:      baseOpacity,
    lineWidth,
    glowSize,
    waveAmplitude,
    waveFreq,
    wavePhase,
    segmentLen,
    gapLen,
    // horizontal scroll offset — ranges 0..canvasW for seamless loop
    offset:       rand(0, canvasW),
    // brightness boost driven externally by GSAP pulse ticker
    pulse:        0,
    // mouse-proximity highlight (0..1)
    highlight:    0,
    // computed this frame
    drawY:        0,
  };
}

function createParticle(line, canvasW) {
  return {
    line,
    x:          rand(0, canvasW),
    speed:      line.speed * rand(1.2, 2.8),
    size:       rand(1.4, 3.6) * line.layer.sizeScale,
    tailLength: rand(35, 110) * line.layer.sizeScale,
    opacity:    line.opacity * rand(0.7, 1.1),
    col:        line.col,
    hexCol:     line.hexCol,
    // shimmer phase for pulsing brightness
    shimmerPhase: rand(0, Math.PI * 2),
    shimmerFreq:  rand(0.8, 2.5),
  };
}

// ─── Drawing primitives ───────────────────────────────────────────────────────

function drawLine(ctx, line, W, H, time) {
  const { layer, hexCol, col, lineWidth, glowSize, opacity, pulse, highlight } = line;
  const finalOpacity = Math.min(1, opacity + pulse * 0.3 + highlight * 0.2);

  const parallaxY = line.layer._parallaxY || 0;
  const y = line.drawY + parallaxY;

  ctx.save();

  if (layer.blur > 0) ctx.filter = `blur(${layer.blur}px)`;

  // ── Glow pass (wide, faint) ──────────────────────────────────────────────
  ctx.beginPath();
  buildLinePath(ctx, line, W, y, time, /* isGlow */ true);
  ctx.strokeStyle = toRgba(col, finalOpacity * 0.15);
  ctx.lineWidth   = lineWidth + glowSize * 1.8;
  ctx.shadowColor = hexCol;
  ctx.shadowBlur  = glowSize * 2.5;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // ── Core line pass ───────────────────────────────────────────────────────
  ctx.beginPath();
  buildLinePath(ctx, line, W, y, time, /* isGlow */ false);
  ctx.strokeStyle = toRgba(col, finalOpacity);
  ctx.lineWidth   = lineWidth;
  ctx.shadowColor = hexCol;
  ctx.shadowBlur  = glowSize;
  ctx.globalAlpha = 1;
  ctx.setLineDash([line.segmentLen, line.gapLen]);
  ctx.lineDashOffset = -line.offset;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

function buildLinePath(ctx, line, W, y, time, isGlow) {
  // Slight quadratic bezier wave across width
  const amp  = isGlow ? line.waveAmplitude * 0.6 : line.waveAmplitude;
  const wave = Math.sin(time * line.waveFreq * 1000 + line.wavePhase) * amp;

  ctx.moveTo(-60,     y);
  ctx.bezierCurveTo(
    W * 0.25, y + wave * 0.8,
    W * 0.75, y - wave * 0.5,
    W + 60,   y + wave * 0.3
  );
}

function drawParticle(ctx, particle, W, time) {
  const { line, size, tailLength, hexCol, col, shimmerPhase, shimmerFreq } = particle;
  const layer = line.layer;

  const parallaxX = layer._parallaxX || 0;
  const parallaxY = layer._parallaxY || 0;

  // Advance particle
  particle.x += particle.speed;
  if (particle.x > W + tailLength + 60) particle.x = -tailLength - 60;

  const px = particle.x + parallaxX;
  const amp  = line.waveAmplitude;
  const wave = Math.sin(time * line.waveFreq * 1000 + line.wavePhase) * amp;
  const py = line.drawY + line.layer._parallaxY + wave;

  const shimmer = 0.7 + 0.3 * Math.sin(time * shimmerFreq * Math.PI * 2 + shimmerPhase);
  const finalOpacity = Math.min(1, particle.opacity * shimmer);

  ctx.save();
  if (layer.blur > 0) ctx.filter = `blur(${layer.blur * 0.4}px)`;

  // ── Gradient tail ────────────────────────────────────────────────────────
  const tailGrad = ctx.createLinearGradient(px - tailLength, py, px, py);
  tailGrad.addColorStop(0, toRgba(col, 0));
  tailGrad.addColorStop(0.4, toRgba(col, finalOpacity * 0.25));
  tailGrad.addColorStop(1,   toRgba(col, finalOpacity * 0.85));

  ctx.beginPath();
  ctx.moveTo(px - tailLength, py);
  ctx.lineTo(px, py);
  ctx.strokeStyle = tailGrad;
  ctx.lineWidth   = size * 0.9;
  ctx.shadowColor = hexCol;
  ctx.shadowBlur  = size * 3.5;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // ── Particle glow halo ───────────────────────────────────────────────────
  const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, size * 4);
  haloGrad.addColorStop(0,   toRgba(col, finalOpacity * 0.35));
  haloGrad.addColorStop(1,   toRgba(col, 0));
  ctx.fillStyle  = haloGrad;
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(px, py, size * 4, 0, Math.PI * 2);
  ctx.fill();

  // ── Particle core ────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(px, py, size, 0, Math.PI * 2);
  ctx.fillStyle  = toRgba(col, finalOpacity);
  ctx.shadowColor = hexCol;
  ctx.shadowBlur  = size * 6;
  ctx.fill();

  // ── Bright white center ──────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(px, py, size * 0.38, 0, Math.PI * 2);
  ctx.fillStyle  = `rgba(255,255,255,${(finalOpacity * 0.9).toFixed(3)})`;
  ctx.shadowBlur = 0;
  ctx.fill();

  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataFlowBackground() {
  const canvasRef   = useRef(null);
  const stateRef    = useRef(null);   // holds all mutable animation state

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    // ── Shared mutable state (never touches React state) ───────────────────
    const state = {
      W: 0, H: 0,
      lines:     [],
      particles: [],
      mouse: {
        x: 0, y: 0,         // smoothed
        targetX: 0, targetY: 0,
      },
      // GSAP-driven global pulse value (0..1)
      globalPulse: { value: 0 },
      rafId: null,
    };
    stateRef.current = state;

    // ── GSAP global pulse timeline ─────────────────────────────────────────
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true });
    pulseTl.to(state.globalPulse, {
      value:    1,
      duration: 4,
      ease:     'sine.inOut',
    });

    // ── Scene builder ──────────────────────────────────────────────────────
    function buildScene() {
      const { W, H } = state;
      const mobile = W < 768;
      state.lines     = [];
      state.particles = [];

      LAYER_DEFS.forEach(layerDef => {
        const lCount = mobile ? layerDef.lineCount.mobile : layerDef.lineCount.desktop;
        const pCount = mobile ? layerDef.particleCount.mobile : layerDef.particleCount.desktop;

        for (let i = 0; i < lCount; i++) {
          const line = createLine(layerDef, W, H, mobile);
          state.lines.push(line);
        }

        // Distribute particles across lines of this layer
        const layerLines = state.lines.filter(l => l.layer.id === layerDef.id);
        if (layerLines.length === 0) return;

        for (let p = 0; p < pCount; p++) {
          const hostLine = layerLines[p % layerLines.length];
          state.particles.push(createParticle(hostLine, W));
        }
      });
    }

    // ── Resize handler ─────────────────────────────────────────────────────
    function onResize() {
      state.W = canvas.width  = window.innerWidth;
      state.H = canvas.height = window.innerHeight;
      buildScene();
    }

    // ── Mouse handler ──────────────────────────────────────────────────────
    function onMouseMove(e) {
      state.mouse.targetX = e.clientX - state.W * 0.5;
      state.mouse.targetY = e.clientY - state.H * 0.5;
    }

    // Touch support for parallax
    function onTouchMove(e) {
      if (!e.touches[0]) return;
      state.mouse.targetX = e.touches[0].clientX - state.W * 0.5;
      state.mouse.targetY = e.touches[0].clientY - state.H * 0.5;
    }

    // ── Render loop ────────────────────────────────────────────────────────
    function render(timestamp) {
      const { W, H, lines, particles, mouse, globalPulse } = state;
      const time = timestamp * 0.001; // seconds

      // Smooth mouse
      mouse.x = lerp(mouse.x, mouse.targetX, 0.04);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.04);

      // ── Background fill ────────────────────────────────────────────────
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);

      // ── Ambient radial vignette (subtle depth) ─────────────────────────
      const vigGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H * 0.85);
      vigGrad.addColorStop(0,   'rgba(0,0,0,0)');
      vigGrad.addColorStop(1,   'rgba(5,7,13,0.55)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      // ── Pre-calculate per-layer parallax offsets ───────────────────────
      LAYER_DEFS.forEach(layerDef => {
        layerDef._parallaxX = mouse.x * layerDef.parallaxFactor * -1;
        layerDef._parallaxY = mouse.y * layerDef.parallaxFactor * -1;
      });

      // ── Advance line scroll offsets & compute drawY ────────────────────
      lines.forEach(line => {
        line.offset = (line.offset + line.speed) % (W + 240);
        line.y      = line.baseY + Math.sin(time * 0.08 + line.wavePhase) * 3;
        line.drawY  = line.y;

        // Mouse proximity highlight — brighten lines near cursor
        const screenY   = line.y + (line.layer._parallaxY || 0);
        const absMY     = mouse.y + H / 2;
        const dy        = Math.abs(screenY - absMY);
        line.highlight  = Math.max(0, 1 - dy / 120) * 0.6;

        // Ingest global GSAP pulse
        line.pulse = globalPulse.value * 0.18;
      });

      // ── Draw — back-to-front ──────────────────────────────────────────
      ['bg', 'mid', 'fg'].forEach(lid => {
        // Lines for this layer
        const layerLines     = lines.filter(l => l.layer.id === lid);
        const layerParticles = particles.filter(p => p.line.layer.id === lid);

        layerLines.forEach(line => drawLine(ctx, line, W, H, time));
        layerParticles.forEach(p  => drawParticle(ctx, p, W, time));
      });

      // ── Subtle horizontal scan-line overlay ───────────────────────────
      const scanY = ((time * 35) % (H + 4)) - 2;
      const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      scanGrad.addColorStop(0,   'rgba(0,212,255,0)');
      scanGrad.addColorStop(0.5, `rgba(0,212,255,${(0.03 + globalPulse.value * 0.04).toFixed(3)})`);
      scanGrad.addColorStop(1,   'rgba(0,212,255,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 2, W, 4);

      state.rafId = requestAnimationFrame(render);
    }

    // ── Init ───────────────────────────────────────────────────────────────
    onResize();
    state.rafId = requestAnimationFrame(render);

    window.addEventListener('resize',    onResize,    { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      pulseTl.kill();
      window.removeEventListener('resize',    onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        display:       'block',
        pointerEvents: 'none',
        zIndex:        0,
        background:    BG_COLOR,
      }}
      aria-hidden="true"
    />
  );
}
