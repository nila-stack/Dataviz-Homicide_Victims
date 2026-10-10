'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PersonIcon from './PersonIcon'

// ── While you've been reading: a live counter based on time spent on the page ────
// Rates: 52 homicides every hour worldwide (UNODC, 2021); 140 women and girls a day
// killed by a partner or relative, one every ~10 minutes (UN Women & UNODC, 2023).

const PER_SECOND = 52 / 3600
const WOMEN_PER_SECOND = 140 / 86400
const GOLD = '#FFBE2A'
const BODY = 'clamp(0.95rem, 1.8vw, 1.05rem)'

// Counted from when the page was opened (module load), so it keeps time across the whole read
const OPENED_AT = typeof performance !== 'undefined' ? performance.now() : 0

const plural = (n, one, many) => (n === 1 ? one : many)
const fmtTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return m > 0 ? `${m} min ${sec} s` : `${sec} s`
}

export default function LiveCounter() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const tick = () => setSeconds((performance.now() - OPENED_AT) / 1000)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const killed = Math.floor(seconds * PER_SECOND)
  const women = Math.floor(seconds * WOMEN_PER_SECOND)

  return (
    <section
      aria-live="off"
      style={{ padding: '72px 24px 80px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 style={{ color: GOLD, fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.2rem)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
          While you’ve been reading
        </h2>
        <p style={{ color: '#EFECE4', fontSize: BODY, lineHeight: 1.75, maxWidth: '920px', marginBottom: '28px' }}>
          You have been on this page for <strong style={{ color: GOLD }}>{fmtTime(seconds)}</strong>.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p style={{ margin: 0, color: GOLD, fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
              {killed < 1 ? '<1' : killed}
            </p>
            <p style={{ margin: '10px 0 0', color: '#EFECE4', fontSize: BODY, lineHeight: 1.6 }}>
              {killed === 0
                ? 'Someone, somewhere, is killed about every 70 seconds.'
                : `${plural(killed, 'person has', 'people have')} been killed somewhere in the world. About one every 70 seconds.`}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#FFB0F4', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
              {women < 1 ? '<1' : women}
            </p>
            <p style={{ margin: '10px 0 0', color: '#EFECE4', fontSize: BODY, lineHeight: 1.6 }}>
              {women === 0
                ? 'A woman or girl is killed by a partner or relative about every 10 minutes.'
                : `${plural(women, 'woman or girl has', 'women and girls have')} been killed by a partner or relative. About one every 10 minutes.`}
            </p>
          </div>
        </div>

        {/* One figure for each person killed so far (capped so the row stays tidy) */}
        <div className="flex flex-wrap" style={{ gap: '4px 3px', marginTop: '28px', minHeight: '40px' }} aria-hidden="true">
          {Array.from({ length: Math.min(killed, 120) }, (_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <PersonIcon color="#7ABFFF" width={13} height={34} />
            </motion.div>
          ))}
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(239,236,228,0.45)' }}>
          Based on average rates: 52 homicides an hour worldwide (UNODC, 2021) and 140 women and girls a day
          killed by a partner or family member (UN Women & UNODC, 2023).
        </p>
      </div>
    </section>
  )
}
