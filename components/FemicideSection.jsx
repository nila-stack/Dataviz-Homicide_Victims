'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── What about femicide? — victim profile cards ──────────────────────────────
// Replaces the earlier Sankey. The data has two real shares (offender familiarity
// 76/24, victim type 60/10/30) plus which motives are linked to each victim type,
// with no case counts for those links. So shares are drawn to scale as bars, and
// motives are shown as tags (linked or not), never as widths that would imply amounts.
// Colours, labels and categories follow the Figma design (node 309:6722).

const FONT = "var(--font-dm-sans), 'DM Sans', sans-serif"
const OFFWHITE = '#EFECE4'

const OFFENDER = {
  known: { label: 'Known offender', short: 'Known', pct: 76, color: '#90371A' },
  stranger: { label: 'Stranger', short: 'Stranger', pct: 24, color: '#B01A1B' },
}

const CATEGORY = {
  intentional: { label: 'Intentional', color: '#EF9F27' },
  opportunistic: { label: 'Opportunistic', color: '#993B5A' },
  preexisting: { label: 'Pre-existing Factors', color: '#0D6448' },
  situational: { label: 'Situational Factors', color: '#3B3681' },
}

const MOTIVE = {
  separation: { label: 'Upset about separation', cat: 'intentional' },
  obsession: { label: 'Obsession/Stalking', cat: 'intentional' },
  possessive: { label: 'Possessive of partner', cat: 'preexisting' },
  jealous: { label: 'Jealous of partner’s life', cat: 'preexisting' },
  assault: { label: 'Sexual Assault', cat: 'intentional' },
  robbery: { label: 'Robbery/Mugging', cat: 'opportunistic' },
  unknown: { label: 'Unknown motive', cat: 'situational' },
}

// Victim types, largest share first; links exactly as in the Figma design
const VICTIMS = [
  { id: 'intimate', label: 'Intimate Partner', pct: 60, offender: 'known',
    motives: ['separation', 'obsession', 'possessive', 'jealous', 'assault', 'unknown'] },
  { id: 'sexual', label: 'Sexual Context', pct: 30, offender: 'stranger',
    motives: ['obsession', 'assault', 'robbery', 'unknown'] },
  { id: 'older', label: 'Older Women', pct: 10, offender: 'stranger',
    motives: ['robbery', 'unknown'] },
]

// Focus = what the reader is pointing at: a motive, a motive category, or an offender type
const matchesMotive = (focus, m) =>
  !focus || (focus.type === 'motive' && focus.id === m) || (focus.type === 'category' && focus.id === MOTIVE[m].cat)
const cardInFocus = (focus, v) =>
  !focus ||
  (focus.type === 'offender' && focus.id === v.offender) ||
  (focus.type !== 'offender' && v.motives.some((m) => matchesMotive(focus, m)))

// Hover on desktop, tap on touch, focus with keyboard
const focusProps = (setFocus, value) => ({
  onMouseEnter: () => setFocus(value),
  onMouseLeave: () => setFocus(null),
  onFocus: () => setFocus(value),
  onBlur: () => setFocus(null),
  onClick: () => setFocus((f) => (f && f.type === value.type && f.id === value.id ? null : value)),
})

// Bars grow from the left. They start at zero width, and a zero-width element never
// registers as "in view", so the trigger comes from a parent container (`inView`).
const grow = (inView, delay) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: inView ? 1 : 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  style: { transformOrigin: 'left' },
})
const useSeen = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return [ref, inView]
}

const smallCaps = { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }

function OffenderBar({ focus, setFocus }) {
  // Each segment is a column: the bar (with its % inside) and its name underneath,
  // so even the narrow 24% segment stays readable on phones
  const [ref, inView] = useSeen()
  return (
    <div ref={ref} style={{ marginBottom: '36px' }}>
      <p style={{ ...smallCaps, color: 'rgba(239,236,228,0.55)', marginBottom: '10px' }}>Who was the offender?</p>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Object.entries(OFFENDER).map(([id, o], i) => {
          const dim = focus?.type === 'offender' && focus.id !== id
          return (
            <button
              key={id}
              type="button"
              aria-label={`${o.label}: ${o.pct}%`}
              aria-pressed={focus?.type === 'offender' && focus.id === id}
              {...focusProps(setFocus, { type: 'offender', id })}
              style={{
                flex: `${o.pct} 0 0`,
                minWidth: 0,
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                fontFamily: FONT,
                cursor: 'pointer',
                opacity: dim ? 0.35 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <motion.span
                {...grow(inView, i * 0.15)}
                style={{
                  transformOrigin: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '44px',
                  padding: '0 12px',
                  background: o.color,
                  borderRadius: '4px',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                {o.pct}%
              </motion.span>
              <span style={{ display: 'block', marginTop: '6px', fontSize: '0.8125rem', fontWeight: 600, color: OFFWHITE, whiteSpace: 'nowrap' }}>
                {o.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MotiveTag({ id, focus, setFocus, delay }) {
  const m = MOTIVE[id]
  const on = matchesMotive(focus, id)
  // Entrance animation lives on the wrapper so it doesn't fight the focus dimming below
  return (
    <motion.span
      style={{ display: 'inline-block' }}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.3, delay }}
    >
    <button
      type="button"
      aria-label={`${m.label} (${CATEGORY[m.cat].label})`}
      {...focusProps(setFocus, { type: 'motive', id })}
      style={{
        background: CATEGORY[m.cat].color,
        color: m.cat === 'intentional' ? '#111' : OFFWHITE,
        border: 'none',
        borderRadius: '6px',
        padding: '7px 11px',
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: '0.8125rem',
        lineHeight: 1.2,
        cursor: 'pointer',
        opacity: on ? 1 : 0.2,
        outline: focus && on ? `2px solid ${OFFWHITE}` : 'none',
        outlineOffset: '2px',
        transition: 'opacity 0.2s, outline-color 0.2s',
      }}
    >
      {m.label}
    </button>
    </motion.span>
  )
}

function VictimCard({ v, index, focus, setFocus }) {
  const off = OFFENDER[v.offender]
  const active = cardInFocus(focus, v)
  const [ref, inView] = useSeen()
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
      }}
    >
    {/* Inner wrapper carries the focus dimming (the article's opacity is driven by its entrance) */}
    <div
      style={{
        padding: '20px 20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        opacity: active ? 1 : 0.35,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Name + share */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
        <h3 style={{ margin: 0, color: OFFWHITE, fontWeight: 700, fontSize: '1.0625rem' }}>{v.label}</h3>
        <span style={{ color: OFFWHITE, fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>{v.pct}%</span>
      </div>

      {/* Share of femicide victims, to scale */}
      <div
        role="img"
        aria-label={`${v.pct}% of femicide victims`}
        style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}
      >
        <motion.div {...grow(inView, 0.2 + index * 0.1)} style={{ transformOrigin: 'left', width: `${v.pct}%`, height: '100%', background: off.color, borderRadius: '999px' }} />
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(239,236,228,0.55)' }}>of femicide victims</p>

      {/* Offender */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ ...smallCaps, color: 'rgba(239,236,228,0.55)' }}>Offender</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600, color: OFFWHITE }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: off.color }} />
          {off.label}
        </span>
      </div>

      {/* Motives */}
      <div>
        <p style={{ ...smallCaps, color: 'rgba(239,236,228,0.55)', margin: '0 0 8px' }}>Motives / triggers</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {v.motives.map((m, i) => (
            <MotiveTag key={m} id={m} focus={focus} setFocus={setFocus} delay={0.3 + index * 0.1 + i * 0.04} />
          ))}
        </div>
      </div>
    </div>
    </motion.article>
  )
}

export default function FemicideSection() {
  const [focus, setFocus] = useState(null)

  return (
    <section style={{ padding: '72px 24px 80px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-5xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{ color: '#FFBE2A', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.2rem)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}
        >
          What About Femicide?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ color: OFFWHITE, fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', lineHeight: 1.75, // same as the silhouette intro
            maxWidth: '920px', marginBottom: '40px' }} // two lines on desktop
        >
          Femicide is the intentional, gender-related killing of women. Examining these cases
          separately reveals distinct patterns hidden within broader crime data: from who commits
          these crimes, to who the victims are, and what drives them.
        </motion.p>

        <OffenderBar focus={focus} setFocus={setFocus} />

        <p style={{ ...smallCaps, color: 'rgba(239,236,228,0.55)', marginBottom: '10px' }}>Who were the victims?</p>
        <div className="grid gap-4 md:grid-cols-3">
          {VICTIMS.map((v, i) => (
            <VictimCard key={v.id} v={v} index={i} focus={focus} setFocus={setFocus} />
          ))}
        </div>

        {/* Motive categories — also a filter */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2" style={{ marginTop: '22px' }}>
          {Object.entries(CATEGORY).map(([id, c]) => {
            const on = !focus || (focus.type === 'category' && focus.id === id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={focus?.type === 'category' && focus.id === id}
                {...focusProps(setFocus, { type: 'category', id })}
                className="flex items-center gap-2"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px 0',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  opacity: on ? 1 : 0.35,
                  transition: 'opacity 0.2s',
                }}
              >
                <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: c.color }} />
                <span style={{ fontSize: '0.8125rem', color: OFFWHITE }}>{c.label}</span>
              </button>
            )
          })}
        </div>

        <p style={{ marginTop: '12px', fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(239,236,228,0.45)', maxWidth: '640px' }}>
          Bars show each group’s share. Hover or tap a motive, a category or an offender type to
          see where it appears.
        </p>


        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: OFFWHITE, fontSize: '0.9375rem', lineHeight: 1.75,
            maxWidth: '640px', marginTop: '28px' }}
        >
          Unlike stranger-perpetrated violence, femicide often develops within existing
          relationships. Because the offender is often someone familiar, early warning signs may
          be overlooked.
        </motion.p>
      </div>
    </section>
  )
}
