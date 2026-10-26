'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Closing image: a chalk outline of a body lying on its side, drawn as the reader arrives ──
// The outline is a list of points (head on the right; the viewBox is cropped to the figure) smoothed into one
// closed curve. Once it has been traced, a blood stain and three evidence markers appear.

const CHALK = '#EFECE4'
const MARKER = '#FFBE2A'
const BLOOD = '#7A1420'

const OUTLINE = [
  // neck, then round the head
  [803, 146], [814, 127], [840, 117], [868, 123], [886, 144], [888, 172], [872, 196], [843, 205],
  [815, 197], [803, 178],
  // the lower arm, bent down and curled back towards the head
  [802, 200], [814, 230], [830, 252], [862, 248], [884, 246], [894, 262], [880, 278], [838, 292],
  [800, 298], [778, 274], [766, 238],
  // underside of the torso to the hip
  [730, 232], [670, 230], [612, 220], [578, 214],
  // the straight bottom leg out to its foot and back
  [500, 232], [420, 244], [342, 250], [312, 254], [290, 244], [294, 224], [318, 214],
  [362, 214], [442, 204], [516, 180], [548, 160],
  // the bent top leg: knee up, foot back down
  [524, 140], [492, 106], [462, 82], [416, 104], [372, 120], [344, 126], [324, 116], [330, 96], [352, 88],
  [400, 76], [446, 38], [478, 30], [520, 64], [584, 102],
  // top of the torso to the shoulder
  [650, 96], [720, 92], [760, 90],
  // the top arm, raised and bent back over the head
  [768, 62], [798, 36], [840, 26], [900, 34], [936, 44], [948, 62], [936, 80], [900, 78],
  [852, 70], [822, 74], [802, 98], [798, 124],
]

// Closed Catmull-Rom spline through the points, as cubic Béziers (rounded for a stable SSR string)
function smoothClosedPath(pts) {
  const r = (n) => Math.round(n * 10) / 10
  const n = pts.length
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${p2[0]},${p2[1]}`
  }
  return `${d} Z`
}

const BODY_PATH = smoothClosedPath(OUTLINE)
const DRAW_SECONDS = 2.8

// A folded evidence tent with its number
function Marker({ x, y, n, delay, show }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -14 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18, delay: show ? delay : 0 }}
    >
      <ellipse cx={x + 22} cy={y + 30} rx="26" ry="6" fill="rgba(0,0,0,0.55)" />
      <path d={`M${x},${y + 30} L${x + 6},${y} L${x + 26},${y} L${x + 32},${y + 30} Z`} fill={MARKER} />
      <path d={`M${x + 26},${y} L${x + 32},${y + 30} L${x + 38},${y + 28} Z`} fill="#C9921A" />
      <text x={x + 16} y={y + 22} textAnchor="middle" fontSize="17" fontWeight="800" fill="#141414"
        style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
        {n}
      </text>
    </motion.g>
  )
}

export default function MarqueeFooter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  return (
    <footer ref={ref} style={{ marginTop: '33px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px' }}>
      <svg
        viewBox="140 0 900 320"
        role="img"
        aria-label="A chalk outline of a body on the ground, with evidence markers numbered 1 to 3"
        style={{ display: 'block', width: '100%', maxWidth: '1100px', height: 'auto', margin: '0 auto', overflow: 'visible' }}
      >
        <defs>
          {/* Rough, powdery chalk: wobble the edge, then knock holes in it with noise */}
          <filter id="chalk" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="wobble" />
            <feDisplacementMap in="SourceGraphic" in2="wobble" scale="5" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="8" result="grain" />
            <feColorMatrix in="grain" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.7" result="speckle" />
            <feComposite in="rough" in2="speckle" operator="in" />
          </filter>
          <filter id="stain" x="-20%" y="-20%" width="140%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="18" />
          </filter>
        </defs>

        {/* Blood pooled under the head, with a few runs down towards the ground */}
        <motion.g
          filter="url(#stain)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 0.9, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: inView ? DRAW_SECONDS * 0.85 : 0 }}
          style={{ transformOrigin: '866px 182px' }}
        >
          <ellipse cx="866" cy="182" rx="40" ry="26" fill={BLOOD} />
          <rect x="836" y="190" width="8" height="58" rx="4" fill={BLOOD} />
          <rect x="862" y="194" width="6" height="74" rx="3" fill={BLOOD} />
          <rect x="886" y="188" width="7" height="44" rx="3.5" fill={BLOOD} />
        </motion.g>

        <motion.path
          d={BODY_PATH}
          fill="none"
          stroke={CHALK}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#chalk)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: inView ? DRAW_SECONDS : 0.6, ease: [0.45, 0, 0.25, 1] }}
        />

        <Marker x={220} y={150} n={3} delay={DRAW_SECONDS + 0.1} show={inView} />
        <Marker x={600} y={262} n={1} delay={DRAW_SECONDS + 0.3} show={inView} />
        <Marker x={924} y={196} n={2} delay={DRAW_SECONDS + 0.5} show={inView} />
      </svg>
    </footer>
  )
}
