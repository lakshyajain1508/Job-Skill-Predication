import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

function CursorGlow() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const springX = useSpring(mouse.x, { stiffness: 140, damping: 22 })
  const springY = useSpring(mouse.y, { stiffness: 140, damping: 22 })

  useEffect(() => {
    const onMove = (event) => setMouse({ x: event.clientX, y: event.clientY })
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[5] hidden h-8 w-8 rounded-full border border-cyan-200/50 md:block"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed z-[4] hidden h-36 w-36 rounded-full bg-gradient-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/20 blur-2xl md:block"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  )
}

export default CursorGlow
