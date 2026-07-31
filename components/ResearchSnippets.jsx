'use client'

import { motion } from 'framer-motion'
import { researchSnippets } from '@/lib/data'

const TORN_CLIP =
  'polygon(0% 4%, 2% 0%, 5% 5%, 8% 0%, 12% 4%, 16% 0%, 20% 5%, 24% 1%, 28% 5%, 33% 0%, 38% 4%, 43% 1%, 48% 5%, 53% 0%, 58% 4%, 63% 1%, 68% 5%, 73% 0%, 78% 4%, 83% 1%, 88% 5%, 93% 0%, 97% 4%, 100% 0%, 100% 96%, 97% 100%, 93% 97%, 89% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 67% 97%, 63% 100%, 59% 97%, 55% 100%, 51% 97%, 47% 100%, 43% 97%, 39% 100%, 35% 97%, 31% 100%, 27% 97%, 23% 100%, 19% 97%, 15% 100%, 11% 97%, 7% 100%, 3% 97%, 0% 100%)'

function TornCard({ title, items, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay }}
      style={{ flex: '1 1 260px', maxWidth: '380px' }}
    >
      <div
        style={{
          clipPath: TORN_CLIP,
          background: '#DDDAC9',
          padding: '36px 28px 40px',
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.1) 27px, rgba(0,0,0,0.1) 28px)',
        }}
      >
        <p
          style={{
            color: '#1a1a1a',
            fontWeight: 800,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            opacity: 0.6,
          }}
        >
          {title}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                color: '#1a1a1a',
                fontSize: '0.9rem',
                fontWeight: 500,
                lineHeight: 1.6,
                paddingLeft: '14px',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', left: 0, color: '#B01A1B', fontWeight: 800 }}>·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function ResearchSnippets() {
  return (
    <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            color: '#FFBE2A',
            fontWeight: 800,
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Research Snippets
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: '#EFECE4',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            maxWidth: '680px',
            marginBottom: '40px',
          }}
        >
          Research also identifies recurring victim characteristics associated with femicide.
          While these patterns do not predict victimisation, they appear repeatedly across cases.
        </motion.p>

        {/* Column sub-headings */}
        <div className="flex flex-wrap gap-8 mb-8">
          <p style={{ flex: '1 1 260px', maxWidth: '380px', color: '#FFBE2A', fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
            For Known Offenders
          </p>
          <p style={{ flex: '1 1 260px', maxWidth: '380px', color: '#FFBE2A', fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
            For Strangers
          </p>
        </div>

        {/* Torn paper cards */}
        <div className="flex flex-wrap gap-8">
          <TornCard title="" items={researchSnippets.knownOffenders} delay={0} />
          <TornCard title="" items={researchSnippets.strangers} delay={0.12} />
        </div>

        {/* Closing paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            color: '#EFECE4',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            maxWidth: '680px',
            marginTop: '40px',
          }}
        >
          We often imagine homicide as unpredictable, driven by chance or committed by strangers.
          But the data tells a different story. While no pattern can predict every tragedy,
          understanding the ones that recur gives us the opportunity to recognise risk, ask
          difficult questions and act sooner.
        </motion.p>

        {/* Sign-off */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            color: '#FFBE2A',
            fontWeight: 800,
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            textAlign: 'center',
            marginTop: '56px',
            letterSpacing: '0.02em',
          }}
        >
          Stay aware. Stay vigilant.
        </motion.p>
      </div>
    </section>
  )
}
