'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Closing image: a chalk outline of a body, drawn as the reader scrolls ────────────
// The outline is traced from the reference drawing (400 × 400 frame). Scrolling down draws it,
// then blood splatters out from the head and five evidence markers drop in around the body;
// scrolling back up erases it all in reverse. A torch switch darkens the scene so the reader
// explores it with a pool of light.

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

// Where each evidence marker stands
const MARKERS = [
  { n: 1, x: 300, y: 100 }, // beside the head
  { n: 2, x: 112, y: 46 },  // by the raised hand
  { n: 3, x: 380, y: 236 }, // by the lower hand
  { n: 4, x: 6, y: 178 },   // by the bent leg's foot
  { n: 5, x: 98, y: 332 },  // by the straight leg's foot
]
const TORCH_RADIUS = 70

// Everything follows the reader's scroll through this section (0 → 1), and runs backwards on the way up:
const CHALK_END = 0.7            // the outline is traced over the first 70%
const BLOOD_RANGE = [0.6, 0.75]  // the pool spreads as the outline closes
const DRIP_START = 0.68          // then the runs trickle down
const markerRange = (n) => [0.7 + n * 0.045, 0.76 + n * 0.045] // markers 1–5 drop in one by one, ending at 98.5%

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

// One run of blood, growing downwards from the pool as the reader scrolls
function Drip({ x, len, w, i, progress }) {
  const range = [DRIP_START, DRIP_START + 0.1 + i * 0.03]
  const scaleY = useTransform(progress, range, [0, 1])
  const opacity = useTransform(progress, range, [0, 0.9])
  return (
    <motion.rect
      x={x - w / 2} y={88} width={w} height={len} rx={w / 2}
      fill={i % 2 ? BLOOD_DARK : BLOOD}
      filter="url(#splatter)"
      style={{ scaleY, opacity, transformOrigin: `${x}px 88px` }}
    />
  )
}

// A folded evidence tent with its number; it drops into place at its point in the scroll
function Marker({ x, y, n, progress }) {
  const range = markerRange(n)
  const opacity = useTransform(progress, range, [0, 1])
  const dropY = useTransform(progress, range, [-10, 0])
  return (
    <motion.g style={{ opacity, y: dropY, pointerEvents: 'none' }}>
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
  // 0 when the section's top is 90% down the screen, 1 when its bottom reaches the bottom of the screen
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start 0.9', 'end end'] })
  const chalk = useTransform(progress, [0, CHALK_END], [0, 1])
  const bloodOpacity = useTransform(progress, BLOOD_RANGE, [0, 0.95])
  const bloodScale = useTransform(progress, BLOOD_RANGE, [0.4, 1])
  const svgRef = useRef(null)
  const [torch, setTorch] = useState(false)
  const [light, setLight] = useState(null) // torch position in drawing units, or null when the pointer is away

  // Pointer position on screen → drawing units, so the light follows the cursor (or finger)
  const moveLight = (e) => {
    const svg = svgRef.current
    if (!torch || !svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    setLight({ x: p.x, y: p.y })
  }

  return (
    <section ref={ref} style={{ marginTop: '33px', paddingBottom: '56px', paddingLeft: '16px', paddingRight: '16px' }}>
      {/* Torch switch, on the right edge of the content column */}
      <div className="max-w-4xl mx-auto flex justify-end" style={{ marginBottom: '8px' }}>
        <button
          type="button"
          role="switch"
          aria-checked={torch}
          onClick={() => { setTorch((t) => !t); setLight(null) }}
          className="flex items-center"
          style={{ gap: '10px', background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
            color: 'rgba(239,236,228,0.75)', fontSize: '0.8125rem', fontFamily: 'var(--font-dm-mono), monospace' }}
        >
          Torch
          <span aria-hidden="true" style={{ position: 'relative', width: '38px', height: '22px', borderRadius: '999px',
            background: torch ? MARKER : 'rgba(239,236,228,0.18)', transition: 'background 0.2s' }}>
            <motion.span
              initial={false}
              animate={{ x: torch ? 16 : 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 32 }}
              style={{ position: 'absolute', top: '3px', left: '3px', width: '16px', height: '16px', borderRadius: '50%',
                background: torch ? '#141414' : '#EFECE4' }}
            />
          </span>
          <span style={{ minWidth: '1.8em', textAlign: 'left' }}>{torch ? 'On' : 'Off'}</span>
        </button>
      </div>

      <svg
        ref={svgRef}
        onPointerDown={moveLight}
        onPointerMove={moveLight}
        onPointerLeave={() => setLight(null)}
        viewBox="0 20 410 360"
        role="img"
        aria-label="A chalk outline of a body on the ground, with blood by the head and five evidence markers"
        // 351px tall: 40px shorter than the first version of this drawing
        // In torch mode a finger drags the light instead of scrolling the page
        style={{ display: 'block', width: '100%', maxWidth: '400px', height: 'auto', margin: '0 auto', overflow: 'visible',
          touchAction: torch ? 'none' : 'auto' }}
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
          {/* Torch mode: the drawing is only visible inside a soft pool of light around the pointer.
              Masking the drawing (rather than laying darkness over the page) leaves no visible edge */}
          <radialGradient id="torch-beam">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="55%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="torch-mask" maskUnits="userSpaceOnUse" x="-60" y="-20" width="530" height="440">
            {light && <circle cx={light.x} cy={light.y} r={TORCH_RADIUS} fill="url(#torch-beam)" />}
          </mask>
        </defs>

        {/* In torch mode everything below is masked to the pool of light */}
        <g mask={torch ? 'url(#torch-mask)' : undefined}>
          {/* Blood splattered from the head: a pool, runs down the ground, and flung droplets */}
          <motion.g
            filter="url(#splatter)"
            style={{ opacity: bloodOpacity, scale: bloodScale, transformOrigin: '370px 84px' }}
          >
            <ellipse cx="368" cy="84" rx="24" ry="17" fill={BLOOD_DARK} />
            <ellipse cx="364" cy="80" rx="15" ry="11" fill={BLOOD} />
            <ellipse cx="386" cy="74" rx="9" ry="12" fill={BLOOD} />
            {DROPS.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={i % 3 ? BLOOD : BLOOD_DARK} />
            ))}
          </motion.g>
          {DRIPS.map(([x, len, w], i) => (
            <Drip key={i} x={x} len={len} w={w} i={i} progress={progress} />
          ))}

          <motion.path
            d={BODY_PATH}
            fill="none"
            stroke={CHALK}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chalk)"
            style={{ pathLength: chalk }}
          />

          {/* Evidence markers drop in once the outline is drawn */}
          {MARKERS.map((m) => (
            <Marker key={m.n} x={m.x} y={m.y} n={m.n} progress={progress} />
          ))}
        </g>
      </svg>
    </section>
  )
}
