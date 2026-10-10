'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '@/lib/data'

// Card proportions from Figma: 849 × 457 → ratio 0.5383
const CARD_WIDTH = 460 // px on screen

// Button layout per Figma nodes 211:5133 (Q1) and 211:5229 (Q2)
// Positions as % of card (849×457 space)
function getButtonStyles(q) {
  // Both answers long (e.g. "About 1 in 5" / "About 1 in 20"): two equal wide buttons,
  // so the ✓ / ✕ marks have room
  if (q.options.every((o) => o.length > 8)) {
    return [
      { top: '60.39%', left: '16.37%', width: '36%', height: '14.23%' },
      { top: '60.39%', left: '56%',    width: '36%', height: '14.23%' },
    ]
  }
  const hasLongOption = q.options.some((o) => o.length > 8)
  if (hasLongOption) {
    // Q2-style: asymmetric — short button left, long button right
    return [
      { top: '60.39%', left: '16.37%', width: '22.97%', height: '14.23%' },
      { top: '60.39%', left: '44.76%', width: '47%',    height: '14.23%' },
    ]
  }
  // Q1-style: two symmetric buttons
  return [
    { top: '60.39%', left: '22.97%', width: '22.97%', height: '14.23%' },
    { top: '60.39%', left: '55.48%', width: '22.97%', height: '14.23%' },
  ]
}

const GOLD = '#FFBE2A'
const WRONG_RED = '#B01A1B'

function QuestionCard({ q }) {
  const [wrong, setWrong] = useState([])      // indices of wrong answers tried so far
  const [solved, setSolved] = useState(false) // the right answer has been picked
  const btnStyles = getButtonStyles(q)

  const pick = (oi) => {
    if (solved) return
    if (oi === q.correct) setSolved(true)
    else if (!wrong.includes(oi)) setWrong([...wrong, oi])
  }

  return (
    <motion.div
      className="shrink-0 select-none"
      style={{ width: `${CARD_WIDTH}px` }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Aspect-ratio container: paper + question text + buttons */}
      <div style={{ position: 'relative', paddingBottom: '53.8%' }}>

        {/* Torn paper background from Figma */}
        <img
          src="/assets/card-paper.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '9.8%',
            left: '3.06%',
            width: '93.88%',
            height: '81.84%',
            pointerEvents: 'none',
          }}
        />

        {/* Paper markings, masked to the torn paper's shape so nothing pokes past its edges.
            This box sits exactly over the paper; inner positions are % of the paper. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '9.8%',
            left: '3.06%',
            width: '93.88%',
            height: '81.84%',
            pointerEvents: 'none',
            maskImage: 'url(/assets/card-paper.svg)',
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: 'url(/assets/card-paper.svg)',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          {/* Ruled notebook lines (card 14% → 88% tall, 8% side margins) */}
          <div
            style={{
              position: 'absolute',
              top: '5.13%',
              left: '5.26%',
              right: '5.26%',
              bottom: '4.45%',
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 20px, rgba(0,0,190,0.09) 20px, rgba(0,0,190,0.09) 21px)',
            }}
          />

          {/* Red margin line — Figma left margin (14.96% of card), runs edge to edge of the paper */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '12.68%',
              width: '1.5px',
              background: 'rgba(176,26,27,0.45)',
            }}
          />
        </div>

        {/* Question text — exact Figma position: top 29.76%, left 14.96% */}
        <p
          style={{
            position: 'absolute',
            top: '29.76%',
            left: '18%',
            right: '6%',
            margin: 0,
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
            lineHeight: 1.55,
          }}
        >
          {q.question}
        </p>

        {/* Answer buttons — absolute positioned at exact Figma insets */}
        {/* Wrong picks turn red and stay red; the right pick gets a tick and reveals the data */}
        {q.options.map((opt, oi) => {
          const isWrong = wrong.includes(oi)
          const isRight = solved && oi === q.correct
          return (
            <motion.button
              key={oi}
              onClick={() => pick(oi)}
              aria-pressed={isWrong || isRight}
              aria-label={isWrong ? `${opt}, wrong answer` : isRight ? `${opt}, right answer` : opt}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: 'absolute',
                ...btnStyles[oi],
                background: isWrong ? WRONG_RED : GOLD,
                color: isWrong ? '#EFECE4' : '#1a1a1a',
                fontWeight: 800,
                fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                border: 'none',
                borderRadius: '10px',
                cursor: solved ? 'default' : 'pointer',
                outline: isRight ? '2.5px solid #1a1a1a' : 'none',
                outlineOffset: '2px',
                opacity: solved && !isRight && !isWrong ? 0.55 : 1,
                transition: 'background 0.15s, color 0.15s, opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                padding: '0 8px',
              }}
            >
              {isWrong && <span aria-hidden="true">✕</span>}
              {isRight && <span aria-hidden="true">✓</span>}
              {opt}
            </motion.button>
          )
        })}
      </div>

      {/* Answer reveal — only for the right answer; OUTSIDE the aspect-ratio box so it never clips */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '10px 20px 4px',
              background: 'rgba(255,190,42,0.12)',
              borderTop: '2px solid rgba(255,190,42,0.3)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.72rem',
                color: GOLD,
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              THE DATA SAYS: {q.dataText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function QuestionnaireSection() {
  const railRef = useRef(null)
  const dragRef = useRef(null)
  const CARD_GAP = 24

  // Trackpad and touch swipes scroll the rail natively. A mouse can also click-drag it;
  // a drag longer than a few px swallows the click so it doesn't press a button.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    dragRef.current = { x: e.clientX, left: railRef.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    if (d.moved) railRef.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    const d = dragRef.current
    dragRef.current = null
    if (d?.moved) {
      // let the click that follows this pointerup know it was a drag
      railRef.current.dataset.dragged = '1'
      setTimeout(() => { if (railRef.current) delete railRef.current.dataset.dragged }, 0)
    }
  }
  const onClickCapture = (e) => {
    if (railRef.current?.dataset.dragged) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <section className="relative px-6" style={{ paddingTop: 129, paddingBottom: 39 }} /* +25 / −25: segment moves down 25px, the next section stays put */>
      <div className="max-w-5xl mx-auto">
        {/* Intro text from Figma */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            color: '#FFBE2A',
            fontWeight: 600,
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            letterSpacing: '0.01em',
            marginBottom: '8px',
          }}
        >
          Before we explore the data, let&apos;s put your instincts to the test.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: 'rgba(239,236,228,0.85)',
            fontWeight: 400,
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            lineHeight: 1.6,
            marginBottom: '82px', // 32 + 30 + 20: moves the swipe hint and cards down
          }}
        >
          Answer these six quick questions based on your first instinct. Don&apos;t overthink it, just trust your gut.
        </motion.p>

        {/* Swipe hint */}
        <p
          className="text-center mb-8 text-sm tracking-widest font-semibold"
          style={{ color: '#FFBE2A', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          ← swipe to see all questions →
        </p>

        {/* Horizontally scrolling rail — two-finger trackpad swipe, touch swipe or mouse drag */}
        <div
          ref={railRef}
          className="no-scrollbar"
          role="region"
          aria-label="Questions"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          style={{ overflowX: 'auto', overflowY: 'hidden', overscrollBehaviorX: 'contain', cursor: 'grab' }}
        >
          <div className="flex pb-4" style={{ gap: `${CARD_GAP}px`, width: 'max-content' }}>
            {questions.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
