'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { researchSnippets } from '@/lib/data'

// ── Research snippets — laid out from Figma (MAIN MAIN PAGE, nodes 299:428–299:1824) ──
// Two torn notebook pages (849 × 457, Figma asset "page"), tilted −5.02° and +5.52°,
// each with a gold heading centred above it. On desktop the pair is placed in Figma's
// own 1805 × 560 composition (scaled to fit); on phones the slips stack.

const PAGE_ASPECT = '849 / 457'
const COMP = { W: 1805, H: 560 } // Figma x 40–1845, y 8690–9250
const NOTE_SIZE = `${(30 / 849) * 100}cqw` // 30px on an 849px page
const HEADING_SIZE = `${(30 / COMP.W) * 100}cqw` // 30px in the composition

const SLIPS = [
  {
    heading: 'For Known Offenders',
    items: researchSnippets.knownOffenders,
    rotate: -5.02,
    left: (25 / COMP.W) * 100, // page centre x 449.5 in the composition
    headingX: (450 / COMP.W) * 100,
    text: { left: 21.7, top: 26.8, width: 55.6, nowrap: false }, // % of the page
  },
  {
    heading: 'For Strangers',
    items: researchSnippets.strangers,
    rotate: 5.52,
    left: (930 / COMP.W) * 100, // page centre x 1354.5
    headingX: (1355 / COMP.W) * 100,
    text: { left: 16.25, top: 22.8, width: 69, nowrap: true },
  },
]

// Gold highlighter, drawn as a background that sweeps from 0% to 100% width.
// `boxDecorationBreak: clone` keeps the mark on every line when a note wraps.
const highlighter = (on) => ({
  backgroundImage: 'linear-gradient(rgba(255,190,42,0.65), rgba(255,190,42,0.65))',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 80%',
  backgroundSize: `${on ? 100 : 0}% 50%`,
  transition: 'background-size 0.35s ease',
  WebkitBoxDecorationBreak: 'clone',
  boxDecorationBreak: 'clone',
})

// One research note: hover sweeps the highlighter across it; click/tap keeps it marked
function Note({ text, index, baseDelay }) {
  const [hover, setHover] = useState(false)
  const [marked, setMarked] = useState(false)
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: baseDelay + index * 0.12 }} // jotted down one by one
    >
      <button
        type="button"
        aria-pressed={marked}
        aria-label={`${text}${marked ? ' (highlighted)' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={() => setMarked((m) => !m)}
        style={{ all: 'unset', cursor: 'pointer', ...highlighter(hover || marked) }}
      >
        {text}
      </button>
    </motion.li>
  )
}

// A torn notebook page at its Figma tilt. Hovering lifts it and straightens it a little,
// like a slip picked up off the desk.
function Slip({ slip, index, active, onActive }) {
  const t = slip.text
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
    >
      <motion.div
        onMouseEnter={() => onActive(index)}
        onMouseLeave={() => onActive(null)}
        initial={false}
        animate={{ rotate: slip.rotate, y: 0 }}
        whileHover={{ rotate: slip.rotate * 0.6, y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{
          position: 'relative',
          aspectRatio: PAGE_ASPECT,
          containerType: 'inline-size',
          filter: active === index ? 'drop-shadow(0 16px 20px rgba(0,0,0,0.5))' : 'none',
          transition: 'filter 0.25s',
        }}
      >
        <img
          src="/assets/notebook-page.svg"
          alt=""
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none' }}
        />
        <ul
          aria-label={slip.heading}
          style={{
            position: 'absolute',
            left: `${t.left}%`,
            top: `${t.top}%`,
            width: `${t.width}%`,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            color: '#000',
            fontWeight: 700,
            fontSize: NOTE_SIZE,
            lineHeight: 1.7,
            whiteSpace: t.nowrap ? 'nowrap' : 'normal',
          }}
        >
          {slip.items.map((item, i) => (
            <Note key={item} text={item} index={i} baseDelay={0.3 + index * 0.12} />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

const headingStyle = {
  color: '#FFBE2A',
  fontWeight: 700,
  textTransform: 'uppercase',
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  margin: 0,
}

export default function ResearchSnippets() {
  const [active, setActive] = useState(null) // index of the slip being hovered
  const dim = (i) => ({ opacity: active !== null && active !== i ? 0.45 : 1, transition: 'opacity 0.25s' })

  return (
    <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            color: '#FFBE2A',
            fontWeight: 800,
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Research Snippets
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: '#EFECE4',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            maxWidth: '680px',
            marginBottom: '40px',
          }}
        >
          Research also identifies recurring victim characteristics associated with femicide.
          While these patterns do not predict victimisation, they appear repeatedly across cases.
        </motion.p>

        {/* Desktop: Figma's composition. From xl up it extends past the text column on
            both sides exactly as in Figma (column x 219–1682 vs slips x 40–1845). */}
        <div
          className="relative hidden md:block xl:w-[123.4%] xl:-ml-[12.24%]"
          style={{ aspectRatio: `${COMP.W} / ${COMP.H}`, containerType: 'inline-size' }}
        >
          {SLIPS.map((s, i) => (
            <div key={s.heading} style={dim(i)}>
              <p
                style={{
                  ...headingStyle,
                  position: 'absolute',
                  left: `${s.headingX}%`,
                  top: `${(12 / COMP.H) * 100}%`,
                  transform: 'translateX(-50%)',
                  fontSize: HEADING_SIZE,
                }}
              >
                {s.heading}
              </p>
              <div
                style={{
                  position: 'absolute',
                  left: `${s.left}%`,
                  top: `${(45 / COMP.H) * 100}%`,
                  width: `${(849 / COMP.W) * 100}%`,
                }}
              >
                <Slip slip={s} index={i} active={active} onActive={setActive} />
              </div>
            </div>
          ))}
        </div>

        {/* Phones: each heading with its slip, stacked */}
        <div className="md:hidden flex flex-col gap-10">
          {SLIPS.map((s, i) => (
            <div key={s.heading} style={dim(i)}>
              <p style={{ ...headingStyle, fontSize: '0.875rem', textAlign: 'center', marginBottom: '14px' }}>
                {s.heading}
              </p>
              <div style={{ width: '94%', margin: '0 auto' }}>
                <Slip slip={s} index={i} active={active} onActive={setActive} />
              </div>
            </div>
          ))}
        </div>

        {/* Closing paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            color: '#EFECE4',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', // same as the silhouette intro
            lineHeight: 1.75,
            // two lines on desktop: wider than this section's 896px column, so it may extend
            // past it on large screens and simply wraps on smaller ones
            width: 'min(1120px, calc(100vw - 48px))',
            maxWidth: 'none',
            marginTop: '40px',
          }}
        >
          We often imagine homicide as unpredictable, driven by chance or committed by strangers.
          But the data tells a different story. While no pattern can predict every tragedy,
          understanding the ones that recur gives us the opportunity to recognise risk, ask
          difficult questions and act sooner.
        </motion.p>

        {/* Sign-off */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            color: '#FFBE2A',
            fontWeight: 800,
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            textAlign: 'center',
            marginTop: '76px', // 56 + 20
            letterSpacing: '0.02em',
          }}
        >
          Stay aware. Stay vigilant.
        </motion.p>
      </div>
    </section>
  )
}
