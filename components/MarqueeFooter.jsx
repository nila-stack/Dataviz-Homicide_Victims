'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Closing image: a chalk outline of a body, drawn as the reader arrives ─────────────
// The outline is traced from the reference drawing (400 × 400 frame). Once it has been
// drawn, blood splatters out from the head and five evidence markers drop in around the
// body; hovering (or tapping) one opens its note. An optional torch mode darkens the scene.

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

// Where each marker stands (its hotspot sits on it),
// and the evidence note it opens: a recap of a finding from earlier in the story
const MARKERS = [
  { n: 1, x: 300, y: 100, title: 'The victim', note: '78% of homicide victims are men.' }, // beside the head
  { n: 2, x: 112, y: 46, title: 'The killer', note: 'Over half of all victims knew their killer.' }, // by the raised hand
  { n: 3, x: 380, y: 236, title: 'Women', note: 'About 3 in 4 women who are killed knew their killer.' }, // by the lower hand
  { n: 4, x: 6, y: 178, title: 'The motive', note: 'Arguments are the most common motive: 28 in every 100 killings.' }, // by the bent leg's foot
  { n: 5, x: 98, y: 332, title: 'Justice', note: 'In the Americas, fewer than 2 in 10 killings end in a conviction.' }, // by the straight leg's foot
]
const TORCH_RADIUS = 70

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

// A folded evidence tent with its number; it lifts a little while it is being examined
function Marker({ x, y, n, show, lifted, delay }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -10 }}
      animate={show ? { opacity: 1, y: lifted ? -5 : 0 } : { opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 520, damping: 20, delay: show && !lifted ? delay : 0 }}
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
  const svgRef = useRef(null)
  const [active, setActive] = useState(null)
  const [torch, setTorch] = useState(false)
  const [light, setLight] = useState(null) // torch position in drawing units, or null when the pointer is away
  const note = MARKERS.find((m) => m.n === active)

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
    <footer ref={ref} style={{ marginTop: '33px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px' }}>
      <svg
        ref={svgRef}
        onPointerDown={moveLight}
        onPointerMove={moveLight}
        onPointerLeave={() => setLight(null)}
        viewBox="0 20 410 360"
        role="group"
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
          {/* White = dark; the soft black spot under the pointer lets the drawing show through */}
          <radialGradient id="torch-beam">
            <stop offset="0%" stopColor="#000" />
            <stop offset="55%" stopColor="#000" />
            <stop offset="100%" stopColor="#fff" />
          </radialGradient>
          {/* The darkness fades out at its edges, so it never shows as a box on the page */}
          <filter id="torch-edge" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <mask id="torch-mask" maskUnits="userSpaceOnUse" x="-80" y="-50" width="570" height="500">
            <rect x="-40" y="-10" width="490" height="420" fill="#fff" filter="url(#torch-edge)" />
            {light && <circle cx={light.x} cy={light.y} r={TORCH_RADIUS} fill="url(#torch-beam)" />}
          </mask>
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

        {/* Evidence markers: they drop in once the outline is drawn; hover or tap one to read it */}
        {MARKERS.map((m) => (
          <Marker key={m.n} x={m.x} y={m.y} n={m.n} show={inView} lifted={active === m.n}
            delay={DRAW_SECONDS + 0.1 + m.n * 0.12} />
        ))}

        {/* Torch mode: darkness everywhere except a soft pool of light around the pointer */}
        {torch && (
          <rect x="-80" y="-50" width="570" height="500" fill="#000" mask="url(#torch-mask)" style={{ pointerEvents: 'none' }} />
        )}

        {/* Hotspots sit on top so they still respond in torch mode */}
        {MARKERS.map((m) => (
          <circle
            key={m.n}
            cx={m.x + 11} cy={m.y + 10} r="24"
            fill="transparent"
            tabIndex={0}
            role="button"
            aria-label={`Evidence ${m.n}: ${m.title}`}
            style={{ cursor: 'pointer', outline: 'none' }}
            onMouseEnter={() => setActive(m.n)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(m.n)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((a) => (a === m.n ? null : m.n))}
          />
        ))}
      </svg>

      {/* The evidence note for the marker being examined */}
      <div aria-live="polite" style={{ maxWidth: '400px', margin: '14px auto 0', minHeight: '3.4em', textAlign: 'center' }}>
        {note ? (
          <motion.p key={note.n} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            style={{ margin: 0, color: '#EFECE4', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            <span style={{ color: MARKER, fontWeight: 700, fontFamily: 'var(--font-dm-mono), monospace' }}>
              Evidence {note.n} · {note.title}
            </span>
            <br />
            {note.note}
          </motion.p>
        ) : (
          <p style={{ margin: 0, color: 'rgba(239,236,228,0.5)', fontSize: '0.8125rem', lineHeight: 1.5,
            fontFamily: 'var(--font-dm-mono), monospace', fontStyle: 'italic' }}>
            {torch ? 'Move the torch over the scene to find the evidence' : 'Hover over or tap a marker to examine the evidence'}
          </p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          type="button"
          aria-pressed={torch}
          onClick={() => setTorch((t) => !t)}
          style={{ background: 'none', border: '1px solid rgba(239,236,228,0.3)', borderRadius: '999px',
            padding: '6px 14px', color: 'rgba(239,236,228,0.8)', fontSize: '0.75rem', cursor: 'pointer',
            fontFamily: 'var(--font-dm-mono), monospace' }}
        >
          {torch ? 'Turn the lights back on' : 'Turn off the lights and use a torch'}
        </button>
      </div>
    </footer>
  )
}
