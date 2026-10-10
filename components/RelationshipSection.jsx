'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { isotypeData } from '@/lib/data'

const MALE = '#7ABFFF'
const FEMALE = '#FFB0F4'
const GENDERS = [
  { key: 'male', color: MALE, label: 'Male victims', noun: ['man', 'men'] },
  { key: 'female', color: FEMALE, label: 'Female victims', noun: ['woman', 'women'] },
]
const nounFor = (key, n) => {
  const g = GENDERS.find((x) => x.key === key)
  return `${n} ${n === 1 ? g.noun[0] : g.noun[1]}`
}

// ── Exact Figma silhouette paths ──────────────────────────────────────────────
function PersonFigure({ color }) {
  return (
    <svg
      viewBox="0 0 53 141.237"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 18, height: 48, flexShrink: 0, display: 'block', fill: color }}
    >
      <path d="M14.4251 26.1932L14.5467 26.1876C18.9812 26.0251 24.2122 26.1598 28.7076 26.1576L34.8741 26.1523C36.9561 26.1514 39.5143 26.0775 41.5183 26.5411C43.9306 27.1034 46.1514 28.2947 47.9544 29.9939C50.9068 32.7475 52.8303 36.8055 52.9391 40.8319C53.0188 43.7857 52.9888 46.773 52.9896 49.729V64.5905V72.8206C52.9904 74.7135 53.0637 76.7285 52.8098 78.5977C52.6963 79.4325 52.2052 80.2824 51.6273 80.8918C50.6813 81.8717 49.3813 82.4298 48.019 82.4409C46.6536 82.4716 45.3323 81.9529 44.3516 81.0013C42.5581 79.2252 42.8979 76.3848 42.8971 74.0473L42.8963 67.5034V44.138L41.3188 44.1413L41.322 106.291L41.3244 125.217L41.3236 130.984C41.3228 133.935 41.635 136.802 39.4662 139.115C36.9963 141.748 32.5035 141.97 29.9193 139.423C28.8897 138.391 28.2038 137.066 27.9563 135.629C27.6914 134.095 27.7576 131.71 27.7584 130.086L27.7632 122.059L27.7616 93.1293L27.76 82.2982L25.2373 82.2997L25.2381 118.715L25.2412 129.198C25.242 131.248 25.3603 133.513 25.067 135.546C24.3044 140.842 17.4663 143.118 13.6562 139.424C11.4074 137.243 11.6772 134.277 11.6762 131.38L11.6782 125.69L11.6778 107.035L11.6823 44.1406L9.78135 44.1368L9.78395 67.1709L9.78971 73.8258C9.79073 75.2984 9.83307 76.7671 9.6668 78.2334C9.40152 80.5733 7.55237 82.2745 5.21239 82.4243C3.89017 82.5102 2.58868 82.0632 1.59812 81.1827C0.392807 80.0932 0.0797567 78.6521 0.0419947 77.099C-0.0200485 74.5455 0.00793484 71.955 0.00927504 69.3976L0.0119552 55.4724L0.00903926 45.9492C0.00872392 43.6662 -0.0866659 40.5165 0.349607 38.3423C0.937401 35.542 2.26159 32.9492 4.18548 30.8312C6.98476 27.7613 10.3382 26.3778 14.4251 26.1932Z" />
      <path d="M26.0691 0.00818176C32.5564 -0.231713 38.0102 4.83328 38.2491 11.3207C38.4887 17.8082 33.4228 23.261 26.9355 23.4994C20.4489 23.7377 14.9972 18.6731 14.7581 12.1867C14.519 5.70039 19.583 0.248156 26.0691 0.00818176Z" />
    </svg>
  )
}

// Rows slide in, then their figures pop in one by one like a tally being counted.
// Replays: rows retract when scrolled away and return on the way back.
const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  shown: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: i * 0.08, delayChildren: i * 0.08 + 0.1, staggerChildren: 0.018 },
  }),
}
const iconVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.7 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 22 } },
}

// ── One relationship row ──────────────────────────────────────────────────────
// Icons flow left-to-right: blue first, then pink — wrapped naturally into rows.
// `gender` highlights one gender (from the legend); `activeRow` focuses one row (hover).
function IsotypeRow({ category, male, female, index, gender, activeRow, setActiveRow }) {
  const total = male + female
  const icons = Array.from({ length: total }, (_, i) => (i < male ? 'male' : 'female'))
  const isActive = activeRow === category
  const dimRow = activeRow !== null && !isActive

  // End-of-row readout: the highlighted gender's count, or the full split while hovered
  const summary = gender
    ? nounFor(gender, gender === 'male' ? male : female)
    : isActive
      ? `${nounFor('male', male)} · ${nounFor('female', female)}`
      : ''

  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: false, margin: '-50px' }}
      tabIndex={0}
      aria-label={`${category}: ${nounFor('male', male)} and ${nounFor('female', female)}`}
      onMouseEnter={() => setActiveRow(category)}
      onMouseLeave={() => setActiveRow(null)}
      onFocus={() => setActiveRow(category)}
      onBlur={() => setActiveRow(null)}
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        alignItems: 'center',
        gap: '16px',
        padding: '18px 0',
        borderTop: '1px dashed rgba(255,255,255,0.12)',
        outline: 'none',
      }}
    >
      {/* Category label, with the readout underneath (space is always reserved, so nothing shifts) */}
      <div>
      <p
        style={{
          color: isActive ? '#EFECE4' : 'rgba(239,236,228,0.75)',
          fontWeight: isActive ? 600 : 500,
          fontSize: '0.9rem',
          lineHeight: 1.4,
          opacity: dimRow ? 0.4 : 1,
          transition: 'opacity 0.2s, color 0.2s',
        }}
      >
        {category}
      </p>
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          minHeight: '1.2em',
          marginTop: '2px',
          fontSize: '0.75rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          color: gender ? (gender === 'male' ? MALE : FEMALE) : 'rgba(239,236,228,0.85)',
          opacity: summary && !dimRow ? 1 : 0,
          transform: summary ? 'none' : 'translateY(-3px)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        {summary}
      </span>
      </div>

      {/* Icon flow */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px 2px',
          alignContent: 'flex-start',
          opacity: dimRow ? 0.3 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {icons.map((g, i) => (
          <motion.span key={i} variants={iconVariants} style={{ display: 'block' }}>
            <span
              style={{
                display: 'block',
                opacity: gender && gender !== g ? 0.15 : 1,
                transition: 'opacity 0.25s',
              }}
            >
              <PersonFigure color={g === 'male' ? MALE : FEMALE} />
            </span>
          </motion.span>
        ))}
      </div>

    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function RelationshipSection() {
  const [locked, setLocked] = useState(null)   // gender chosen by clicking the legend
  const [preview, setPreview] = useState(null) // gender previewed by hovering the legend
  const [activeRow, setActiveRow] = useState(null)
  const gender = preview ?? locked

  return (
    <section
      style={{ padding: '72px 24px 80px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{
            color: '#EFECE4',
            fontWeight: 800,
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          Who Killed Them?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            color: '#EFECE4',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', // same as the silhouette intro
            lineHeight: 1.7,
            maxWidth: '640px',
            marginBottom: '8px',
          }}
        >
          Contrary to popular belief, homicide is rarely an act committed by a random stranger.
          For many victims, the offender was someone they already knew.
        </motion.p>

        {/* Legend — doubles as a filter: hover to preview, click to keep one gender highlighted */}
        <div className="flex flex-wrap items-center gap-4 mb-2 mt-14">
          {GENDERS.map((l) => {
            const on = locked === l.key
            return (
              <button
                key={l.key}
                type="button"
                aria-pressed={on}
                onMouseEnter={() => setPreview(l.key)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(l.key)}
                onBlur={() => setPreview(null)}
                onClick={() => setLocked(on ? null : l.key)}
                className="flex items-center gap-2"
                style={{
                  background: on ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: `1px solid ${on ? l.color : 'transparent'}`,
                  borderRadius: '999px',
                  padding: '4px 12px 4px 8px',
                  marginLeft: '-8px',
                  cursor: 'pointer',
                  opacity: gender && gender !== l.key ? 0.4 : 1,
                  transition: 'opacity 0.2s, border-color 0.2s, background 0.2s',
                }}
              >
                <PersonFigure color={l.color} />
                <span style={{ fontSize: '0.8125rem', color: on ? '#EFECE4' : 'rgba(239,236,228,0.65)' }}>
                  {l.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Rows */}
        <div>
          {isotypeData.map((row, i) => (
            <IsotypeRow
              key={row.category}
              {...row}
              index={i}
              gender={gender}
              activeRow={activeRow}
              setActiveRow={setActiveRow}
            />
          ))}
        </div>

        {/* Hint for the legend filter, under the chart */}
        <p
          style={{
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px dashed rgba(255,255,255,0.12)',
            fontSize: '0.75rem',
            color: 'rgba(239,236,228,0.4)',
          }}
        >
          {locked
            ? 'Click the highlighted legend again to show everyone'
            : 'Hover or click “Male victims” / “Female victims” above to compare'}
        </p>
      </div>
    </section>
  )
}
