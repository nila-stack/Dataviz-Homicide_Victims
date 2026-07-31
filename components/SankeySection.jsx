'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Color constants (exact from Figma node 211:6540) ─────────────────────────
const C_KNOWN    = '#6B1010'   // dark brownish-red — Known offender bar
const C_STRANGER = '#B91C1C'   // bright crimson    — Stranger bar
const C_GOLD     = '#EF9F27'   // Intentional motives
const C_TEAL     = '#0D6448'   // Pre-existing factors
const C_PINK     = '#993B5A'   // Opportunistic motives
const C_PURPLE   = '#3B3681'   // Situational motives

// ── SVG layout constants ──────────────────────────────────────────────────────
const VW = 820
const Y0 = 22          // chart top
const CH = 510         // proportion baseline (used only to compute % heights)

const C0X = 62, C0W = 24    // Col 0 — FAMILIARITY
const C1X = 382, C1W = 24   // Col 1 — COMMON VICTIM TYPES
const C2X = 582, C2W = 214  // Col 2 — MOTIVES / TRIGGERS
const BOX_H = 62
const BOX_GAP = 11

const GAP0 = 7
const GAP1 = 18

// ── Bar Y-positions (proportional) ───────────────────────────────────────────
const KNOWN_H    = Math.round(0.76 * CH)
const KNOWN_Y    = Y0
const STRANGER_H = CH - KNOWN_H
const STRANGER_Y = KNOWN_Y + KNOWN_H + GAP0

const IP_H = Math.round(0.60 * CH)
const IP_Y = Y0
const OW_H = Math.round(0.10 * CH)
const OW_Y = IP_Y + IP_H + GAP1
const SC_H = CH - IP_H - OW_H
const SC_Y = OW_Y + OW_H + GAP1

// ── Right column boxes (7 equal, centered against col 1's actual span) ───────
const BOX_STEP  = BOX_H + BOX_GAP
const COL1_SPAN = (SC_Y + SC_H) - IP_Y
const BOX_Y0    = IP_Y + Math.floor((COL1_SPAN - (7 * BOX_H + 6 * BOX_GAP)) / 2)
const bY = (i) => BOX_Y0 + i * BOX_STEP

const CONTENT_BOTTOM = Math.max(
  STRANGER_Y + STRANGER_H,
  SC_Y + SC_H,
  BOX_Y0 + 7 * BOX_H + 6 * BOX_GAP
)
const HEADING_Y = CONTENT_BOTTOM + 26
const LEGEND_Y  = CONTENT_BOTTOM + 56
const VH        = LEGEND_Y + 32

const BOXES = [
  { label: 'Upset about separation',   color: C_GOLD,   type: 'Intentional'   },
  { label: 'Obsession/Stalking',        color: C_GOLD,   type: 'Intentional'   },
  { label: 'Possessive of partner',     color: C_TEAL,   type: 'Pre-existing'  },
  { label: "Jealous of partner's life", color: C_TEAL,   type: 'Pre-existing'  },
  { label: 'Sexual Assault',            color: C_GOLD,   type: 'Intentional'   },
  { label: 'Robbery/Mugging',           color: C_PINK,   type: 'Opportunistic' },
  { label: 'Unknown motive',            color: C_PURPLE, type: 'Situational'   },
]

// ── Bezier flow path helper ───────────────────────────────────────────────────
function fp(x0, y0, h0, x1, y1, h1) {
  const mx = (x0 + x1) / 2
  return `M ${x0} ${y0} C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1} L ${x1} ${y1 + h1} C ${mx} ${y1 + h1} ${mx} ${y0 + h0} ${x0} ${y0 + h0} Z`
}

// ── Col 0 → Col 1 flows ───────────────────────────────────────────────────────
const KN_TO_IP = IP_H
const KN_TO_OW = OW_H
const KN_TO_SC = KNOWN_H - KN_TO_IP - KN_TO_OW

const F01 = [
  { d: fp(C0X+C0W, KNOWN_Y,                   KN_TO_IP,  C1X, IP_Y,            IP_H),       c: `${C_KNOWN}77`    },
  { d: fp(C0X+C0W, KNOWN_Y+KN_TO_IP,          KN_TO_OW,  C1X, OW_Y,            OW_H),       c: `${C_KNOWN}77`    },
  { d: fp(C0X+C0W, KNOWN_Y+KN_TO_IP+KN_TO_OW, KN_TO_SC,  C1X, SC_Y,            KN_TO_SC),   c: `${C_KNOWN}55`    },
  { d: fp(C0X+C0W, STRANGER_Y,                 STRANGER_H, C1X, SC_Y+KN_TO_SC,  STRANGER_H), c: `${C_STRANGER}77` },
]

// ── Col 1 → Col 2 flows ───────────────────────────────────────────────────────
// NOTE: reconstructed from pixel-analysis of the reference design — most boxes
// draw from TWO victim-type sources, not one. In particular "Sexual Assault"
// draws mainly from Sexual Context (not just Intimate Partner), which is what
// produces the long diagonal ribbon crossing over the teal flows. If you have
// the real underlying percentages, swap the split values below for exact ones.

const ipUpset      = Math.round(IP_H * 0.21)
const ipObsession  = Math.round(IP_H * 0.19)
const ipPossessive = Math.round(IP_H * 0.20)
const ipJealous    = Math.round(IP_H * 0.20)
const ipSexAssault = IP_H - ipUpset - ipObsession - ipPossessive - ipJealous

const owObsession = Math.round(OW_H * 0.30)
const owRobbery    = OW_H - owObsession

const scSexAssault = Math.round(SC_H * 0.42)
const scRobbery     = Math.round(SC_H * 0.12)
const scUnknown     = SC_H - scSexAssault - scRobbery

// Walk down each bar, allocating consecutive slices in this order
let _y = IP_Y
const ipSlice = {}
;[['upset', ipUpset], ['obsession', ipObsession], ['possessive', ipPossessive],
  ['jealous', ipJealous], ['sexAssault', ipSexAssault]].forEach(([k, h]) => { ipSlice[k] = [_y, h]; _y += h })

_y = OW_Y
const owSlice = {}
;[['obsession', owObsession], ['robbery', owRobbery]].forEach(([k, h]) => { owSlice[k] = [_y, h]; _y += h })

_y = SC_Y
const scSlice = {}
;[['robbery', scRobbery], ['sexAssault', scSexAssault], ['unknown', scUnknown]].forEach(([k, h]) => { scSlice[k] = [_y, h]; _y += h })

// Stack multiple incoming ribbons within the same target box, top to bottom, in call order
const _targetFill = [0, 0, 0, 0, 0, 0, 0]
function destY(boxIndex, h) {
  const y = bY(boxIndex) + _targetFill[boxIndex]
  _targetFill[boxIndex] += h
  return y
}
function link(srcYH, boxIndex, color) {
  const [sy, sh] = srcYH
  const ty = destY(boxIndex, sh)
  return { d: fp(C1X + C1W, sy, sh, C2X, ty, sh), c: color }
}

const F12 = [
  link(ipSlice.upset,      0, `${C_GOLD}AA`),
  link(ipSlice.obsession,  1, `${C_GOLD}AA`),
  link(owSlice.obsession,  1, `${C_GOLD}88`),
  link(ipSlice.possessive, 2, `${C_TEAL}AA`),
  link(ipSlice.jealous,    3, `${C_TEAL}AA`),
  link(ipSlice.sexAssault, 4, `${C_GOLD}AA`),
  link(scSlice.sexAssault, 4, `${C_GOLD}88`),
  link(owSlice.robbery,    5, `${C_PINK}AA`),
  link(scSlice.robbery,    5, `${C_PINK}88`),
  link(scSlice.unknown,    6, `${C_PURPLE}AA`),
]

const LEGEND = [
  { label: 'Intentional',          color: C_GOLD   },
  { label: 'Pre-existing Factors', color: C_TEAL   },
  { label: 'Opportunistic',        color: C_PINK   },
  { label: 'Situational',          color: C_PURPLE },
]

function VLabel({ x, y, text, sz = 14, w = '600' }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fill="#f7f7f5"
      fontSize={sz}
      fontWeight={w}
      fontFamily="var(--font-dm-sans),'DM Sans',sans-serif"
      transform={`rotate(-90 ${x} ${y})`}
    >{text}</text>
  )
}

export default function SankeySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ padding: '72px 24px 80px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0B0B0C' }}>
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
          style={{ color: '#EFECE4', fontSize: '0.9375rem', lineHeight: 1.75,
            maxWidth: '680px', marginBottom: '40px' }}
        >
          Femicide is the intentional, gender-related killing of women. Examining these cases
          separately reveals distinct patterns hidden within broader crime data — from who commits
          these crimes, to who the victims are, and what drives them.
        </motion.p>

        <div ref={ref} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', minWidth: '640px', maxWidth: `${VW}px`, display: 'block' }}
            aria-label="Sankey diagram: femicide familiarity, victim types, and motives"
          >
            <rect x={0} y={0} width={VW} height={VH} fill="#0B0B0C" />

            {/* Col 0 → Col 1 flows */}
            {F01.map((f, i) => (
              <motion.path key={`f01-${i}`} d={f.d} fill={f.c}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06 }} />
            ))}

            {/* Col 1 → Col 2 flows */}
            {F12.map((f, i) => (
              <motion.path key={`f12-${i}`} d={f.d} fill={f.c}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.42 + i * 0.07 }} />
            ))}

            {/* Col 0 bars */}
            <motion.rect x={C0X} rx={3} width={C0W} fill={C_KNOWN}
              initial={{ height: 0, y: KNOWN_Y + KNOWN_H / 2 }}
              animate={inView ? { height: KNOWN_H, y: KNOWN_Y } : {}}
              transition={{ duration: 0.55, delay: 0.05 }} />
            <motion.rect x={C0X} rx={3} width={C0W} fill={C_STRANGER}
              initial={{ height: 0, y: STRANGER_Y + STRANGER_H / 2 }}
              animate={inView ? { height: STRANGER_H, y: STRANGER_Y } : {}}
              transition={{ duration: 0.55, delay: 0.1 }} />

            {/* Col 0 vertical labels */}
            <VLabel x={C0X - 16} y={KNOWN_Y + KNOWN_H / 2}       text="Known offender" sz={13} />
            <VLabel x={C0X - 33} y={KNOWN_Y + KNOWN_H / 2}       text="76 %"            sz={12} w="700" />
            <VLabel x={C0X - 16} y={STRANGER_Y + STRANGER_H / 2} text="Stranger"        sz={13} />
            <VLabel x={C0X - 33} y={STRANGER_Y + STRANGER_H / 2} text="24 %"            sz={12} w="700" />

            {/* Col 1 bars */}
            <motion.rect x={C1X} rx={3} width={C1W} fill={C_KNOWN}
              initial={{ height: 0, y: IP_Y + IP_H / 2 }}
              animate={inView ? { height: IP_H, y: IP_Y } : {}}
              transition={{ duration: 0.55, delay: 0.1 }} />
            <motion.rect x={C1X} rx={3} width={C1W} fill={C_KNOWN}
              initial={{ height: 0, y: OW_Y + OW_H / 2 }}
              animate={inView ? { height: OW_H, y: OW_Y } : {}}
              transition={{ duration: 0.55, delay: 0.15 }} />
            <motion.rect x={C1X} rx={3} width={C1W} fill={C_STRANGER}
              initial={{ height: 0, y: SC_Y + SC_H / 2 }}
              animate={inView ? { height: SC_H, y: SC_Y } : {}}
              transition={{ duration: 0.55, delay: 0.2 }} />

            {/* Col 1 vertical labels */}
            <VLabel x={C1X - 16} y={IP_Y + IP_H / 2} text="Intimate Partner" sz={13} />
            <VLabel x={C1X - 33} y={IP_Y + IP_H / 2} text="60 %"              sz={12} w="700" />
            <VLabel x={C1X - 16} y={OW_Y + OW_H / 2} text="Older Women"       sz={10} />
            <VLabel x={C1X - 33} y={OW_Y + OW_H / 2} text="10 %"              sz={10} w="700" />
            <VLabel x={C1X - 16} y={SC_Y + SC_H / 2} text="Sexual Context"    sz={13} />
            <VLabel x={C1X - 33} y={SC_Y + SC_H / 2} text="30 %"              sz={12} w="700" />

            {/* Col 2 boxes */}
            {BOXES.map((box, i) => (
              <g key={box.label}>
                <motion.rect x={C2X} width={C2W} rx={7} y={bY(i)} height={BOX_H}
                  fill={box.color}
                  initial={{ opacity: 0, x: 18 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.58 + i * 0.07 }} />
                <motion.text
                  x={C2X + 14} y={bY(i) + BOX_H / 2 + 5}
                  fill="#111" fontSize="13" fontWeight="600"
                  fontFamily="var(--font-dm-sans),'DM Sans',sans-serif"
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.72 + i * 0.07 }}
                >{box.label}</motion.text>
              </g>
            ))}

            {/* Column headings */}
            {[
              { label: 'FAMILIARITY',         x: C0X + C0W / 2 },
              { label: 'COMMON VICTIM TYPES', x: C1X + C1W / 2 },
              { label: 'MOTIVES / TRIGGERS',  x: C2X + C2W / 2 },
            ].map(({ label, x }) => (
              <text key={label} x={x} y={HEADING_Y} textAnchor="middle"
                fill="#f7f7f5" fontSize="11" fontWeight="700" letterSpacing="0.09em"
                fontFamily="var(--font-dm-sans),'DM Sans',sans-serif">{label}</text>
            ))}

            {/* Legend */}
            {LEGEND.map((item, i) => {
              const lx = 58 + i * 185, ly = LEGEND_Y
              return (
                <g key={item.label}>
                  <rect x={lx} y={ly - 9} width={14} height={14} rx={3} fill={item.color} />
                  <text x={lx + 20} y={ly + 4} fill="#EFECE4" fontSize="11"
                    fontFamily="var(--font-dm-sans),'DM Sans',sans-serif">{item.label}</text>
                </g>
              )
            })}

          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: '#EFECE4', fontSize: '0.9375rem', lineHeight: 1.75,
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