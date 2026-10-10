'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { waffleCategories } from '@/lib/data'

// Build the flat array of 100 cells from category definitions
function buildCells(categories) {
  const cells = []
  categories.forEach(cat => {
    for (let i = 0; i < cat.count; i++) {
      cells.push({ color: cat.color, label: cat.label, count: cat.count })
    }
  })
  return cells
}

// `active` is the reason currently hovered anywhere in the grid; other reasons dim so its
// whole group stands out. Grey (not yet revealed) boxes don't respond to hover.
function WaffleCell({ cell, index, progress, active, onHover }) {
  const [hovered, setHovered] = useState(false)

  const NEUTRAL = '#2a2824'
  const threshold = index / 100
  const burstEnd  = threshold + 0.015

  // Strictly greater, so at the very top every box is grey (the default state)
  const background = useTransform(progress, (p) =>
    p > threshold ? cell.color : NEUTRAL,
  )
  const scale = useTransform(progress, [threshold, burstEnd], [0.65, 1])
  const dimmed = active !== null && active !== cell.label

  return (
    <div style={{ position: 'relative', aspectRatio: '3/2', zIndex: hovered ? 2 : 'auto' }}>
      <motion.div
        style={{
          background,
          scale,
          width: '100%',
          height: '100%',
          borderRadius: '2px',
          opacity: dimmed ? 0.3 : 1,
          transition: 'opacity 0.2s',
          cursor: hovered ? 'help' : 'default',
        }}
        whileHover={hovered ? { scale: 1.15 } : undefined}
        onHoverStart={() => {
          if (progress.get() <= threshold) return
          setHovered(true)
          onHover(cell.label)
        }}
        onHoverEnd={() => {
          setHovered(false)
          onHover(null)
        }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              x: '-50%', // via framer, so the y animation doesn't overwrite the centring
              background: 'rgba(10,10,10,0.95)',
              color: '#EFECE4',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '5px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 50,
              border: `1px solid ${cell.color}`,
              letterSpacing: '0.03em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                background: cell.color,
                borderRadius: '1px',
                marginRight: '6px',
                verticalAlign: 'middle',
              }}
            />
            {cell.label}
            <span style={{ opacity: 0.6, fontWeight: 500 }}> · {cell.count}% of cases</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WaffleSection() {
  const sectionRef = useRef(null)
  const cells = useMemo(() => buildCells(waffleCategories), [])
  const [active, setActive] = useState(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.65'],
  })

  // Two-way: boxes fill as you scroll down and return to grey as you scroll back up

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: '150vh', position: 'relative', padding: '80px 0 120px' }}
    >
      <div style={{ position: 'sticky', top: '40px', padding: '0 24px' }}>
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <p
            style={{
              color: '#EFECE4',
              fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
              lineHeight: 1.75,
              maxWidth: '680px',
              marginBottom: '32px',
            }}
          >
            Knowing who committed the crime is only part of the story. Looking at the
            circumstances behind each homicide reveals recurring patterns that go far beyond
            random acts of violence.
          </p>

          {/* 10×10 waffle grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
              gap: '4px',
              maxWidth: '560px',
            }}
          >
            {cells.map((cell, i) => (
              <WaffleCell key={i} cell={cell} index={i} progress={scrollYProgress} active={active} onHover={setActive} />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
            {waffleCategories.map(cat => (
              <div key={cat.label} className="flex items-center gap-2">
                <div
                  style={{
                    width: '16px',
                    height: '12px',
                    background: cat.color,
                    borderRadius: '2px',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: '#EFECE4', opacity: 0.8 }}>
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
