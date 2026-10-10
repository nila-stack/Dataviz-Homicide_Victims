'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Closer to home: one average day of murders in India, as a single bar ─────────
// Source: NCRB, Crime in India 2022. 28,522 murder FIRs (≈ 78 a day). Leading motives:
// disputes 9,962, personal vendetta or enmity 3,761, gain 1,884; the remaining 12,915
// cover every other recorded motive. Yearly totals ÷ 365, rounded (largest remainder)
// to add up to 78: 27 + 10 + 5 + 36. Each slice of the bar is one murder.

const GOLD = '#FFBE2A'
const BODY = 'clamp(0.95rem, 1.8vw, 1.05rem)'
const TOTAL = 28522
const PER_DAY = 78

const MOTIVES = [
  { label: 'Disputes', cases: 9962, perDay: 27, color: '#F5DFA0' }, // same colour as "Argument / Personal Conflicts"
  { label: 'Personal vendetta or enmity', cases: 3761, perDay: 10, color: '#E8935A' },
  { label: 'Gain', cases: 1884, perDay: 5, color: '#9B9B3A' },
  { label: 'All other recorded motives', cases: 12915, perDay: 36, color: '#8a8679' },
]

const pct = (m) => Math.round((m.cases / TOTAL) * 100)

export default function IndiaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [focus, setFocus] = useState(null)
  const active = MOTIVES.find((m) => m.label === focus)
  let slice = 0 // running index so the slices rise left to right across the whole day

  return (
    <section style={{ padding: '72px 24px 80px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{ color: GOLD, fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.2rem)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}
        >
          Closer to home
        </motion.h2>
        {/* One line on desktop (it may run past the 896px column); wraps on smaller screens */}
        <p className="md:whitespace-nowrap" style={{ color: '#EFECE4', fontSize: BODY, lineHeight: 1.75, marginBottom: '4px' }}>
          India recorded {TOTAL.toLocaleString('en-IN')} murders in 2022, about 78 every day. As in the global data, the most common motive was a dispute.
        </p>
        <p style={{ color: 'rgba(239,236,228,0.6)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '28px' }}>
          One average day, one bar: each slice is one murder. Hover or tap a colour to read it.
        </p>

        {/* Readout: the whole day, or the motive being pointed at */}
        <p style={{ minHeight: '1.6em', marginBottom: '12px', fontSize: '1rem', color: '#EFECE4' }} aria-live="polite">
          {active ? (
            <>
              <strong style={{ color: active.color }}>{active.label}</strong>
              <span style={{ color: 'rgba(239,236,228,0.7)' }}>
                {' '}· {active.perDay} a day · {active.cases.toLocaleString('en-IN')} in 2022 ({pct(active)}%)
              </span>
            </>
          ) : (
            <>
              <strong style={{ color: GOLD }}>{PER_DAY}</strong>
              <span style={{ color: 'rgba(239,236,228,0.7)' }}> murders on an average day</span>
            </>
          )}
        </p>

        {/* The day: four groups whose widths follow their share, made of one slice per murder */}
        <div ref={ref} className="flex" style={{ gap: '6px' }} role="img"
          aria-label="One average day of murders in India: 27 disputes, 10 personal vendetta or enmity, 5 gain, 36 other motives">
          {MOTIVES.map((m) => {
            const dim = focus && focus !== m.label
            return (
              <div
                key={m.label}
                onMouseEnter={() => setFocus(m.label)}
                onMouseLeave={() => setFocus(null)}
                onClick={() => setFocus((f) => (f === m.label ? null : m.label))}
                style={{ flex: `${m.perDay} 0 0`, minWidth: 0, cursor: 'pointer', opacity: dim ? 0.25 : 1, transition: 'opacity 0.2s' }}
              >
                <div className="flex" style={{ gap: '2px', height: 'clamp(70px, 12vw, 120px)', alignItems: 'flex-end' }}>
                  {Array.from({ length: m.perDay }, (_, i) => {
                    const delay = 0.1 + slice++ * 0.018
                    return (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: inView ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay }}
                        style={{ flex: 1, height: '100%', background: m.color, borderRadius: '2px', transformOrigin: 'bottom' }}
                      />
                    )
                  })}
                </div>
                {/* Group label under its own part of the bar (desktop) */}
                <p className="hidden md:block" style={{ margin: '10px 0 0', fontSize: '0.8125rem', lineHeight: 1.35, color: '#EFECE4' }}>
                  <strong style={{ fontWeight: 700 }}>{m.perDay}</strong>{' '}
                  <span style={{ color: 'rgba(239,236,228,0.65)' }}>{m.label.toLowerCase()}</span>
                </p>
              </div>
            )
          })}
        </div>

        {/* Phones: a compact legend, since the narrow groups can't hold labels */}
        <div className="md:hidden flex flex-col gap-2" style={{ marginTop: '16px' }}>
          {MOTIVES.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setFocus((f) => (f === m.label ? null : m.label))}
              className="flex items-center gap-2"
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer',
                opacity: focus && focus !== m.label ? 0.4 : 1 }}
            >
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: m.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: '#EFECE4' }}>
                <strong>{m.perDay}</strong> {m.label.toLowerCase()}
              </span>
            </button>
          ))}
        </div>

        <p style={{ marginTop: '24px', fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(239,236,228,0.45)', maxWidth: '720px' }}>
          Source: National Crime Records Bureau (NCRB), Crime in India 2022.
        </p>
      </div>
    </section>
  )
}
