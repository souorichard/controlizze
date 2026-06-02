'use client'

import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface TypingTextProps {
  text: string
  className?: string
  speed?: number
}

export function TypingText({ text, className, speed = 80 }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i === text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [isInView, text, speed])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="text-foreground/60"
        >
          |
        </motion.span>
      )}
    </span>
  )
}
