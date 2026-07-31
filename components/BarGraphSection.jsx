'use client'

import { motion } from 'framer-motion'
import { barData } from '@/lib/data'

export default function BarGraphSection() {
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
            <div key={d.label}>
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
                    }}
                  />
                </div>

                {/* Percentage */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.15 }}
                  style={{
                    color: '#EFECE4',
                    fontWeight: 700,
                    fontSize: '1rem',
                    width: '42px',
                    flexShrink: 0,
                  }}
                >
                  {d.value} %
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
