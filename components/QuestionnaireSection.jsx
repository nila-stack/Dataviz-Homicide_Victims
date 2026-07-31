'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '@/lib/data'

// Card proportions from Figma: 849 × 457 → ratio 0.5383
const CARD_WIDTH = 460 // px on screen

// Button layout per Figma nodes 211:5133 (Q1) and 211:5229 (Q2)
// Positions as % of card (849×457 space)
function getButtonStyles(q) {
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

function QuestionCard({ q }) {
  const [picked, setPicked] = useState(null)
  const btnStyles = getButtonStyles(q)

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

        {/* Ruled notebook lines */}
        <div
          style={{
            position: 'absolute',
            top: '14%',
            left: '8%',
            right: '8%',
            bottom: '12%',
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 20px, rgba(0,0,190,0.09) 20px, rgba(0,0,190,0.09) 21px)',
            pointerEvents: 'none',
          }}
        />

        {/* Red margin line — matches Figma left margin */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            bottom: '12%',
            left: '14.96%',
            width: '1.5px',
            background: 'rgba(176,26,27,0.45)',
            pointerEvents: 'none',
          }}
        />

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
        {q.options.map((opt, oi) => (
          <button
            key={oi}
            onClick={() => setPicked(oi)}
            style={{
              position: 'absolute',
              ...btnStyles[oi],
              background: picked === oi ? '#d4a020' : '#FFBE2A',
              color: '#1a1a1a',
              fontWeight: 800,
              fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              outline: picked === oi && oi === q.correct ? '2.5px solid #B01A1B' : 'none',
              outlineOffset: '2px',
              transition: 'background 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              padding: '0 8px',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Answer reveal — OUTSIDE the aspect-ratio box so it never clips */}
      <AnimatePresence>
        {picked !== null && (
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
                color: picked === q.correct ? '#FFBE2A' : 'rgba(239,236,228,0.75)',
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
  const constraintRef = useRef(null)
  const CARD_GAP = 24
  const totalDrag = (questions.length - 1) * (CARD_WIDTH + CARD_GAP)

  return (
    <section
      className="relative py-16 px-6"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
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
            marginBottom: '32px',
          }}
        >
          Answer these four quick questions based on your first instinct. Don&apos;t overthink it, just trust your gut.
        </motion.p>

        {/* Swipe hint */}
        <p
          className="text-center mb-8 text-sm tracking-widest font-semibold"
          style={{ color: '#FFBE2A', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          ← swipe to see all questions →
        </p>

        {/* Draggable container */}
        <div ref={constraintRef} style={{ overflow: 'hidden', cursor: 'grab' }}>
          <motion.div
            className="flex pb-4"
            style={{ gap: `${CARD_GAP}px`, cursor: 'grab', width: 'max-content' }}
            drag="x"
            dragConstraints={{ left: -totalDrag, right: 0 }}
            dragElastic={0.05}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {questions.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === 0 ? '#FFBE2A' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
