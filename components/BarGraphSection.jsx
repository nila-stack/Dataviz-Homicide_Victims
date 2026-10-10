'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useMotionValue, useTransform } from 'framer-motion'
import { barData } from '@/lib/data'

// Percentage that counts up from 0 in step with its bar growing
function CountUp({ value, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, { duration: 1.1, ease: 'easeOut', delay })
    return () => controls.stop()
  }, [inView, count, value, delay])
  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span> %
    </span>
  )
}

// 76 → "3 in 4", 52 → "1 in 2": the simplest fraction (denominator ≤ 10) close to the value
function inEvery(pct) {
  let best = null
  for (let d = 2; d <= 10; d++) {
    const n = Math.round((pct / 100) * d)
    const err = Math.abs(n / d - pct / 100)
    if (n > 0 && (!best || err < best.err - 0.005)) best = { n, d, err }
  }
  return `${best.n} in ${best.d}`
}

export default function BarGraphSection() {
  // Hovering (or focusing) a bar dims the other one and spells its value out in words
  const [hovered, setHovered] = useState(null)

  return (
    <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Section hook */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{ color: '#FFBE2A', fontWeight: 700, fontSize: '1.0625rem', marginBottom: '6px' }}
        >
          One pattern stood out…
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ color: '#EFECE4', fontSize: '0.9375rem', marginBottom: '28px', opacity: 0.85 }}
        >
          Victims killed by someone they knew:
        </motion.p>

        {/* Bars */}
        <div className="flex flex-col gap-5">
          {barData.map((d, i) => (
            <div
              key={d.label}
              tabIndex={0}
              aria-label={`${d.label}: ${d.value}%, about ${inEvery(d.value)} ${d.label.toLowerCase()} knew their killer`}
              onMouseEnter={() => setHovered(d.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(d.label)}
              onBlur={() => setHovered(null)}
              style={{
                opacity: hovered && hovered !== d.label ? 0.35 : 1,
                transition: 'opacity 0.25s',
                outline: 'none',
                cursor: 'default',
              }}
            >
              <div className="flex items-center gap-4 mb-2">
                <span
                  style={{
                    color: '#EFECE4',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    width: '64px',
                    flexShrink: 0,
                  }}
                >
                  {d.label}
                </span>

                {/* Bar track */}
                <div
                  style={{
                    flex: 1,
                    height: '28px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.value}%` }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: i * 0.15 }}
                    style={{
                      height: '100%',
                      background: d.color,
                      borderRadius: '3px',
                      filter: hovered === d.label ? 'brightness(1.12)' : 'none',
                      transition: 'filter 0.25s',
                    }}
                  />

                  {/* Value in words, revealed on hover */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: `translateY(-50%) translateX(${hovered === d.label ? 0 : -6}px)`,
                      opacity: hovered === d.label ? 1 : 0,
                      transition: 'opacity 0.25s, transform 0.25s',
                      color: '#1a1a1a',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    ≈ {inEvery(d.value)} {d.label.toLowerCase()}
                  </span>
                </div>

                {/* Percentage */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.3, delay: i * 0.15 }}
                  style={{
                    color: '#EFECE4',
                    fontWeight: 700,
                    fontSize: '1rem',
                    width: '42px',
                    flexShrink: 0,
                  }}
                >
                  <CountUp value={d.value} delay={i * 0.15} />
                </motion.span>
              </div>
            </div>
          ))}
        </div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            color: '#EFECE4',
            fontWeight: 800,
            fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
            lineHeight: 1.3,
            marginTop: '36px',
            letterSpacing: '-0.01em',
          }}
        >
          Women are far more likely to know their killer !
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            color: '#EFECE4',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            marginTop: '16px',
            opacity: 0.8,
          }}
        >
          This brought me to a larger question…
        </motion.p>
      </div>
    </section>
  )
}
