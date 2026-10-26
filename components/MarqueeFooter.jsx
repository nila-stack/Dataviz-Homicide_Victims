'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Closing image: a chalk outline of a body, drawn as the reader arrives ─────────────
// The outline is traced from the reference drawing (400 × 400 frame). Once it has been
// drawn, blood splatters out from the head. Five evidence markers sit hidden around the
// body and appear when the reader hovers (or taps) their spot.

const CHALK = '#EFECE4'
const MARKER = '#FFBE2A'
const BLOOD_DARK = '#4E0B13'
const BLOOD = '#7A1420'

const OUTLINE = [
  [230, 36], [242, 37], [295, 56], [314, 81], [324, 77], [323, 64], [343, 50], [362, 47], [372, 48],
  [383, 68], [382, 83], [365, 96], [347, 95], [340, 102], [359, 226], [369, 251], [369, 258],
  [358, 268], [347, 269], [340, 258], [342, 234], [330, 186], [327, 139], [323, 132], [296, 150],
  [276, 152], [212, 219], [169, 250], [90, 331], [86, 336], [85, 355], [81, 359], [72, 361],
  [70, 356], [58, 302], [64, 300], [79, 296], [137, 231], [200, 167], [135, 146], [126, 145],
  [89, 211], [84, 233], [43, 229], [23, 219], [19, 216], [20, 214], [27, 205], [53, 203], [56, 200],
  [87, 120], [107, 103], [198, 119], [258, 83], [262, 79], [258, 76], [228, 64], [176, 73],
  [159, 86], [141, 85], [133, 79], [134, 71], [142, 58], [168, 56],
]
const BODY_PATH = `M${OUTLINE.map((p) => p.join(',')).join(' L')} Z`

// Where each hidden marker lives: the hotspot the reader hovers, and where the tent stands
const MARKERS = [
  { n: 1, x: 300, y: 100 }, // beside the head
  { n: 2, x: 112, y: 46 },  // by the raised hand
  { n: 3, x: 380, y: 236 }, // by the lower hand
  { n: 4, x: 6, y: 178 },   // by the bent leg's foot
  { n: 5, x: 98, y: 332 },  // by the straight leg's foot
]

const DRAW_SECONDS = 1.7 // 40% faster than the first version (2.8 s)

// Fixed pseudo-random droplets around the head (deterministic, so server and client match)
const DROPS = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180
  const d = 30 + ((i * 53) % 37)
  return {
    cx: Math.round((372 + Math.cos(a) * d * 0.9) * 10) / 10,
    cy: Math.round((86 + Math.sin(a) * d * 0.7) * 10) / 10,
    r: 0.8 + ((i * 7) % 5) * 0.45,
  }
})

// Drips running down from the pool: x, length, width
const DRIPS = [[352, 52, 3.2], [362, 88, 4], [374, 40, 2.6], [384, 66, 3.4], [394, 30, 2.2]]

// A folded evidence tent with its number
function Marker({ x, y, n, show }) {
  return (
    <motion.g
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 520, damping: 20 }}
      style={{ pointerEvents: 'none' }}
    >
      <ellipse cx={x + 14} cy={y + 20} rx="17" ry="3.5" fill="rgba(0,0,0,0.6)" />
      <path d={`M${x},${y + 20} L${x + 4},${y} L${x + 18},${y} L${x + 22},${y + 20} Z`} fill={MARKER} />
      <path d={`M${x + 18},${y} L${x + 22},${y + 20} L${x + 26},${y + 18} Z`} fill="#C9921A" />
      <text x={x + 11} y={y + 15} textAnchor="middle" fontSize="12" fontWeight="800" fill="#141414"
        style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
        {n}
      </text>
    </motion.g>
  )
}

export default function MarqueeFooter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const [hovered, setHovered] = useState(null)

  return (
    <footer ref={ref} style={{ marginTop: '33px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px' }}>
      <svg
        viewBox="0 20 410 360"
        role="img"
        aria-label="A chalk outline of a body on the ground, with blood by the head and five hidden evidence markers"
        // 351px tall: 40px shorter than the first version of this drawing
        style={{ display: 'block', width: '100%', maxWidth: '400px', height: 'auto', margin: '0 auto', overflow: 'visible' }}
      >
        <defs>
          {/* Rough, powdery chalk: wobble the edge, then knock holes in it with noise */}
          <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="wobble" />
            <feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.2" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="8" result="grain" />
            <feColorMatrix in="grain" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="speckle" />
            <feComposite in="rough" in2="speckle" operator="in" />
          </filter>
          {/* Blood: ragged splash edges plus a mottled, grainy surface */}
          <filter id="splatter" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="11" result="edge" />
            <feDisplacementMap in="SourceGraphic" in2="edge" scale="10" result="ragged" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="grain" />
            <feColorMatrix in="grain" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="pores" />
            <feComposite in="ragged" in2="pores" operator="in" />
          </filter>
        </defs>

        {/* Blood splattered from the head: a pool, runs down the ground, and flung droplets */}
        <motion.g
          filter="url(#splatter)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 0.95, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1], delay: inView ? DRAW_SECONDS * 0.8 : 0 }}
          style={{ transformOrigin: '370px 84px' }}
        >
          <ellipse cx="368" cy="84" rx="24" ry="17" fill={BLOOD_DARK} />
          <ellipse cx="364" cy="80" rx="15" ry="11" fill={BLOOD} />
          <ellipse cx="386" cy="74" rx="9" ry="12" fill={BLOOD} />
          {DROPS.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={i % 3 ? BLOOD : BLOOD_DARK} />
          ))}
        </motion.g>
        {DRIPS.map(([x, len, w], i) => (
          <motion.rect
            key={i}
            x={x - w / 2} y={88} width={w} height={len} rx={w / 2}
            fill={i % 2 ? BLOOD_DARK : BLOOD}
            filter="url(#splatter)"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={inView ? { scaleY: 1, opacity: 0.9 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.9 + i * 0.12, ease: 'easeIn', delay: inView ? DRAW_SECONDS * 0.8 + 0.3 : 0 }}
            style={{ transformOrigin: `${x}px 88px` }}
          />
        ))}

        <motion.path
          d={BODY_PATH}
          fill="none"
          stroke={CHALK}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#chalk)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: inView ? DRAW_SECONDS : 0.4, ease: [0.45, 0, 0.25, 1] }}
        />

        {/* Hidden evidence: each spot shows its numbered marker on hover or tap */}
        {MARKERS.map((m) => (
          <g key={m.n}>
            <Marker x={m.x} y={m.y} n={m.n} show={inView && hovered === m.n} />
            <circle
              cx={m.x + 11} cy={m.y + 10} r="24"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(m.n)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered((h) => (h === m.n ? null : m.n))}
              aria-label={`Evidence marker ${m.n}`}
            />
          </g>
        ))}
      </svg>
    </footer>
  )
}
