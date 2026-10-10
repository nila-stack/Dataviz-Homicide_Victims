'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { waffleCategories } from '@/lib/data'

// ── Why did it happen? Scrollytelling over a mosaic of the 100 cases ─────────
// Modelled on The Pudding's sticky-grid pattern: a full-screen mosaic of 100 tiles
// (one per case, scattered, coloured by circumstance) stays pinned while black panels
// scroll over it. As each panel reaches the middle of the screen, only that
// circumstance's tiles light up; scrolling back reverses it.
// Shares come from the same data as the waffle (lib/data.js). The definitions are
// plain-language explanations with no added statistics; the illustrations are symbolic
// line drawings, kept non-graphic on purpose.

const FONT = "var(--font-dm-sans), 'DM Sans', sans-serif"
const OFFWHITE = '#EFECE4'

// Per-circumstance definition, keyed by the waffle category label
const DETAIL = {
  'Argument / Personal Conflicts': {
    text: 'A dispute between people who know each other, over money, respect, jealousy or an insult, escalates until someone is killed. These killings are rarely planned; they often happen in the heat of the moment.',
  },
  'Gang / Organized Crime': {
    text: 'Killings linked to gangs or criminal groups, often over territory, drug markets, debts or revenge for an earlier attack. Victims are often young men involved in, or caught close to, the conflict.',
  },
  'Domestic Violence': {
    text: 'A killing inside the home by a partner, ex-partner or family member, often the end point of a long history of abuse and control. It is the setting where women are most at risk.',
  },
  Robbery: {
    text: 'A killing during a theft or mugging. The offender is after money or valuables, and the violence escalates when the victim resists or is seen as a threat.',
  },
  'Sexual Homicide': {
    text: 'A killing connected to a sexual assault, either during the attack or to silence the victim afterwards. It is among the rarest circumstances, but one of the most feared.',
  },
  'No Motive / Unknown': {
    text: 'Cases where no reason could be established: the offender was never identified, the case is unsolved, or the motive was never made clear. Every one is still a life lost.',
  },
}

// Panel artwork (cropped from the supplied illustration sheet, transparent PNGs), shown in a dark well
const ART = {
  'Argument / Personal Conflicts': '/assets/causes/argument.png',
  'Gang / Organized Crime': '/assets/causes/gang.png',
  'Domestic Violence': '/assets/causes/domestic.png',
  Robbery: '/assets/causes/robbery.png',
  'Sexual Homicide': '/assets/causes/sexual.png',
  'No Motive / Unknown': '/assets/causes/unknown.png',
}

// ── The mosaic: 100 cases, scattered with a fixed seed so the layout never changes ──
function seededShuffle(arr, seed) {
  const a = [...arr]
  let t = seed
  const rand = () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// Exactly 100 tiles — one per case — scattered with a fixed seed
const CASES = seededShuffle(
  waffleCategories.flatMap((c) => Array.from({ length: c.count }, () => c)),
  1957,
)

// Square tiles can't fill a wide screen with exactly 100, so the grid is a little bigger
// and its corners are cut away (empty, invisible cells) to leave exactly 100 squares:
// • 14 × 8 = 112 on wider screens, minus a 3-cell L at each corner
// • 6 × 17 = 102 on phones, minus the two bottom corners
const DESKTOP_GAPS = new Set([0, 1, 14, 12, 13, 27, 84, 98, 99, 97, 110, 111])
const MOBILE_GAP_BEFORE_CASE = 96 // bottom-left corner; the bottom-right one closes the list
const CELLS = (() => {
  const out = []
  let k = 0
  for (let d = 0; d < 112; d++) {
    if (DESKTOP_GAPS.has(d)) { out.push({ gap: 'desktop' }); continue }
    if (k === MOBILE_GAP_BEFORE_CASE) out.push({ gap: 'mobile' })
    out.push({ cause: CASES[k], index: k })
    k++
  }
  out.push({ gap: 'mobile' })
  return out
})()
// A fixed pseudo-random delay per tile gives the "shimmer" when a colour lights up
const TILE_DELAY = CASES.map((_, i) => ((i * 37) % 100) * 4)

const DARK_TILE = '#24221f'

function Tile({ cause, active, index }) {
  const lit = active === 'all' || active === cause.label
  const showArt = active === cause.label
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '6px',
        background: lit ? cause.color : DARK_TILE,
        opacity: lit ? 1 : 0.9,
        transition: `background 0.45s ease ${TILE_DELAY[index]}ms`,
        overflow: 'hidden',
      }}
    >
      <img
        src={ART[cause.label]}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: 'absolute', left: '10%', top: '10%', width: '80%', height: '80%',
          objectFit: 'contain',
          opacity: showArt ? 1 : 0,
          transform: `scale(${showArt ? 1 : 0.9})`,
          transition: `opacity 0.4s ease ${TILE_DELAY[index] + 150}ms, transform 0.4s ease ${TILE_DELAY[index] + 150}ms`,
        }}
      />
    </div>
  )
}

function Mosaic({ active }) {
  return (
    <div
      // Square tiles, 6 × 17 on phones and 14 × 8 on wider screens. The tile size (--s) is
      // whichever is smaller — what fits the width (minus 25px each side and the 6px gaps)
      // or what fits the screen height — and the grid sits centred.
      className="grid justify-center content-center [--cols:6] md:[--cols:14] [--s:min(calc((100vw_-_50px_-_30px)/6),calc((100svh_-_12px_-_96px)/17))] md:[--s:min(calc((100vw_-_50px_-_78px)/14),calc((100svh_-_12px_-_42px)/8))]"
      style={{
        gridTemplateColumns: 'repeat(var(--cols), var(--s))',
        gridAutoRows: 'var(--s)',
        gap: '6px',
        padding: '6px 25px',
        height: '100%',
      }}
    >
      {CELLS.map((cell, i) =>
        cell.gap ? (
          // Corner cut-outs: empty space, shown only in the layout they belong to
          <div key={`gap-${i}`} className={cell.gap === 'desktop' ? 'hidden md:block' : 'md:hidden'} />
        ) : (
          <Tile key={i} cause={cell.cause} index={cell.index} active={active} />
        ),
      )}
    </div>
  )
}

// ── A step: a black panel that scrolls over the mosaic ─────────────────────────
// When it is in the middle of the screen it sets the mosaic's highlight.
function Step({ id, onActive, children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' }) // the middle 10% band of the screen
  useEffect(() => {
    if (inView) onActive(id)
  }, [inView, id, onActive])
  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      <div
        ref={ref}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(8,8,8,0.94)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '28px 28px 30px',
          fontFamily: FONT,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function CausePanel({ cause, active }) {
  const detail = DETAIL[cause.label]
  const on = active === cause.label
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
        <h3 style={{ margin: 0, color: OFFWHITE, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 }}>{cause.label}</h3>
        <span style={{ color: cause.color, fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>{cause.count}%</span>
      </div>
      <div style={{ margin: '14px 0 4px', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: `${cause.count}%`, height: '100%', background: cause.color, borderRadius: '999px', transformOrigin: 'left' }}
        />
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(239,236,228,0.55)' }}>
        {cause.count} in every 100 cases, shown by the lit tiles behind this panel
      </p>
      <div
        style={{
          margin: '18px 0',
          background: 'rgba(255,255,255,0.04)', // the same low-opacity dark well the line drawings sat in
          borderRadius: '6px',
          height: '190px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.img
          src={ART[cause.label]}
          alt=""
          draggable={false}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.94 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
      <p style={{ margin: 0, color: 'rgba(239,236,228,0.85)', fontSize: '0.9375rem', lineHeight: 1.7 }}>{detail.text}</p>
    </>
  )
}

export default function CauseCards() {
  // null = nothing lit yet, 'all' = every tile in its colour, or a circumstance label
  const [active, setActive] = useState(null)

  return (
    <section aria-label="Why did it happen?" style={{ position: 'relative', marginTop: '30px' }}>
      {/* Pinned mosaic */}
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }} aria-hidden="true">
        <Mosaic active={active} />
      </div>

      {/* Panels scroll over it */}
      <div style={{ position: 'relative', marginTop: '-100svh' }}>
        <Step id="all" onActive={setActive}>
          <h2 style={{ margin: '0 0 12px', color: '#FFBE2A', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.2rem)',
            letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Why did it happen?
          </h2>
          <p style={{ margin: 0, color: OFFWHITE, fontSize: '1rem', lineHeight: 1.7 }}>
            Each tile is one case, 100 in all. Every one of them began somewhere. Scroll on to see what led to each death.
          </p>
        </Step>

        {waffleCategories.map((c) => (
          <Step key={c.label} id={c.label} onActive={setActive}>
            <CausePanel cause={c} active={active} />
          </Step>
        ))}

        <Step id="all" onActive={setActive}>
          <p style={{ margin: 0, color: OFFWHITE, fontSize: '1rem', lineHeight: 1.7 }}>
            An argument that went too far. A robbery gone wrong. Sometimes, no reason at all. Each tile was someone’s life.
          </p>
        </Step>
      </div>
    </section>
  )
}
