import { motion, useReducedMotion } from 'motion/react'

const blobs = [
  { className: 'bg-primary/20', size: 420, top: '-10%', left: '-8%', duration: 22 },
  { className: 'bg-accent/20', size: 360, top: '55%', left: '72%', duration: 26 },
  { className: 'bg-secondary/60', size: 300, top: '15%', left: '60%', duration: 30 },
]

/**
 * Subtle floating gradient blobs behind page content.
 * Disabled automatically when the user prefers reduced motion.
 * Do NOT mount this inside ReaderShell — reading mode should stay still.
 */
export function AnimatedBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
          }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 40, -30, 0], y: [0, -30, 20, 0] }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}