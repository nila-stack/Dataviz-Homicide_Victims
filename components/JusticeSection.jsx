'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Who gets justice? Convictions per 10 homicide victims, as stamped case files ──
// Source: UNODC Global Study on Homicide 2023 (2021 or latest year, 82 countries).
// The report gives these as "per 10 victims": Europe 8, Asia around 6, global around 4,
// the Americas fewer than 2 (drawn as 1½: one full stamp and one half stamp).

const GOLD = '#FFBE2A'
const STAMP_RED = '#C0262A'
const MANILA = '#DCC48E'
const MANILA_TAB = '#C9AE74'
const BODY = 'clamp(0.95rem, 1.8vw, 1.05rem)' // same as the other intro paragraphs

const ROWS = [
  { region: 'Europe', convicted: 8, label: '8 in 10' },
  { region: 'Asia', convicted: 6, label: 'About 6 in 10' },
  { region: 'World', convicted: 4, label: 'About 4 in 10', world: true },
  { region: 'Americas', convicted: 1.5, label: 'Fewer than 2 in 10' },
]

// A manila case folder; `stamp` is how much of it carries the CONVICTED stamp (0, 0.5 or 1)
function CaseFile({ stamp, caseNo, delay, inView }) {
  return (
    // containerType lets the stamp text size itself to the folder's width (cqw)
    <div style={{ position: 'relative', aspectRatio: '4 / 3', marginTop: '8px', containerType: 'inline-size' }}>
      {/* tab */}
      <div style={{ position: 'absolute', top: '-8px', left: '8%', width: '42%', height: '12px',
        background: MANILA_TAB, borderRadius: '4px 4px 0 0' }} />
      {/* body */}
      <div style={{ position: 'absolute', inset: 0, background: MANILA, borderRadius: '3px',
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', left: '8%', top: '12%', fontSize: '0.5625rem', fontWeight: 700,
          letterSpacing: '0.08em', color: 'rgba(40,30,10,0.55)', fontFamily: "var(--font-dm-mono), monospace" }}>
          No. {caseNo}
        </span>
        {stamp === 0 && (
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', textAlign: 'center',
            fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(40,30,10,0.4)' }}>
            OPEN
          </span>
        )}
        {stamp > 0 && (
          // The stamp drops in large and slams down; a half stamp is clipped to its left half
          <motion.div
            initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
            animate={inView ? { opacity: 0.92, scale: 1, rotate: -14 } : {}}
            transition={{ type: 'spring', stiffness: 700, damping: 26, delay }}
            style={{
              position: 'absolute', left: '6%', right: '6%', top: '34%',
              border: `2px solid ${STAMP_RED}`, borderRadius: '3px',
              color: STAMP_RED, textAlign: 'center', fontWeight: 900,
              fontSize: '10.5cqw', letterSpacing: '0.04em', whiteSpace: 'nowrap', padding: '3px 0',
              mixBlendMode: 'multiply',
              clipPath: stamp < 1 ? 'inset(-20% 50% -20% -20%)' : undefined,
            }}
          >
            CONVICTED
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Row({ row, index, focus, setFocus }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const dim = focus !== null && focus !== row.region
  return (
    <div
      ref={ref}
      onMouseEnter={() => setFocus(row.region)}
      onMouseLeave={() => setFocus(null)}
      style={{ padding: '18px 0', borderTop: '1px dashed rgba(255,255,255,0.12)', opacity: dim ? 0.35 : 1, transition: 'opacity 0.2s' }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: '10px' }}>
        <p style={{ margin: 0, color: row.world ? GOLD : '#EFECE4', fontWeight: 700, fontSize: '0.95rem',
          letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {row.region}
        </p>
        <p style={{ margin: 0, color: '#EFECE4', fontWeight: 700, fontSize: '0.95rem' }}>{row.label}</p>
      </div>
      <div
        className="grid grid-cols-5 md:grid-cols-10"
        style={{ gap: '10px 8px' }}
        role="img"
        aria-label={`${row.region}: ${row.label} homicides lead to a conviction`}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <CaseFile
            key={i}
            stamp={Math.max(0, Math.min(1, row.convicted - i))}
            caseNo={String(1000 + index * 137 + i * 29).slice(-4)}
            delay={0.25 + i * 0.12}
            inView={inView}
          />
        ))}
      </div>
    </div>
  )
}

export default function JusticeSection() {
  const [focus, setFocus] = useState(null)

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
          Who gets justice?
        </motion.h2>
        <p style={{ color: '#EFECE4', fontSize: BODY, lineHeight: 1.75, maxWidth: '920px', marginBottom: '24px' }}>
          For every 10 people killed, how many killers are convicted? It depends on where the victim lived.
          Here, every folder is one case.
        </p>

        {ROWS.map((r, i) => (
          <Row key={r.region} row={r} index={i} focus={focus} setFocus={setFocus} />
        ))}

        <p style={{ color: '#EFECE4', fontSize: BODY, lineHeight: 1.75, maxWidth: '920px', marginTop: '28px' }}>
          Killings tied to gangs and organised crime are less likely to be solved than killings at home, one
          reason fewer than 2 in 10 killings in the Americas end in a conviction.
        </p>
        <p style={{ marginTop: '12px', fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(239,236,228,0.45)' }}>
          Source: UNODC, Global Study on Homicide 2023 (2021 or latest available year, 82 countries).
        </p>
      </div>
    </section>
  )
}
