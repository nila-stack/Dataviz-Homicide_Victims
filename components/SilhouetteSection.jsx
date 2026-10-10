'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MALE_COUNT, TOTAL_SILHOUETTES } from '@/lib/data'

// ── Exact Figma silhouette paths (viewBox: 0 0 53 141.237) ───────────────────
function PersonFigure({ fill }) {
  return (
    <motion.svg
      viewBox="0 0 53 141.237"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%', fill, overflow: 'visible' }}
    >
      {/* Body */}
      <path d="M14.4251 26.1932L14.5467 26.1876C18.9812 26.0251 24.2122 26.1598 28.7076 26.1576L34.8741 26.1523C36.9561 26.1514 39.5143 26.0775 41.5183 26.5411C43.9306 27.1034 46.1514 28.2947 47.9544 29.9939C50.9068 32.7475 52.8303 36.8055 52.9391 40.8319C53.0188 43.7857 52.9888 46.773 52.9896 49.729V64.5905V72.8206C52.9904 74.7135 53.0637 76.7285 52.8098 78.5977C52.6963 79.4325 52.2052 80.2824 51.6273 80.8918C50.6813 81.8717 49.3813 82.4298 48.019 82.4409C46.6536 82.4716 45.3323 81.9529 44.3516 81.0013C42.5581 79.2252 42.8979 76.3848 42.8971 74.0473L42.8963 67.5034V44.138L41.3188 44.1413L41.322 106.291L41.3244 125.217L41.3236 130.984C41.3228 133.935 41.635 136.802 39.4662 139.115C36.9963 141.748 32.5035 141.97 29.9193 139.423C28.8897 138.391 28.2038 137.066 27.9563 135.629C27.6914 134.095 27.7576 131.71 27.7584 130.086L27.7632 122.059L27.7616 93.1293L27.76 82.2982L25.2373 82.2997L25.2381 118.715L25.2412 129.198C25.242 131.248 25.3603 133.513 25.067 135.546C24.3044 140.842 17.4663 143.118 13.6562 139.424C11.4074 137.243 11.6772 134.277 11.6762 131.38L11.6782 125.69L11.6778 107.035L11.6823 44.1406L9.78135 44.1368L9.78395 67.1709L9.78971 73.8258C9.79073 75.2984 9.83307 76.7671 9.6668 78.2334C9.40152 80.5733 7.55237 82.2745 5.21239 82.4243C3.89017 82.5102 2.58868 82.0632 1.59812 81.1827C0.392807 80.0932 0.0797567 78.6521 0.0419947 77.099C-0.0200485 74.5455 0.00793484 71.955 0.00927504 69.3976L0.0119552 55.4724L0.00903926 45.9492C0.00872392 43.6662 -0.0866659 40.5165 0.349607 38.3423C0.937401 35.542 2.26159 32.9492 4.18548 30.8312C6.98476 27.7613 10.3382 26.3778 14.4251 26.1932Z" />
      {/* Head */}
      <path d="M26.0691 0.00818176C32.5564 -0.231713 38.0102 4.83328 38.2491 11.3207C38.4887 17.8082 33.4228 23.261 26.9355 23.4994C20.4489 23.7377 14.9972 18.6731 14.7581 12.1867C14.519 5.70039 19.583 0.248156 26.0691 0.00818176Z" />
    </motion.svg>
  )
}

// ── Single cell: color is driven by a "max-only" progress value ───────────────
function SilhouetteCell({ index, progress }) {
  const NEUTRAL    = '#4A4842'   // neutral gray on dark bg
  const finalColor = index < MALE_COUNT ? '#7ABFFF' : '#FFB0F4'
  const threshold  = index / TOTAL_SILHOUETTES

  // Strictly greater, so at the very top every figure is grey (the default state)
  const fill = useTransform(progress, (p) =>
    p > threshold ? finalColor : NEUTRAL
  )

  return (
    <div style={{ aspectRatio: '0.6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PersonFigure fill={fill} />
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function SilhouetteSection() {
  const sectionRef = useRef(null)

  // Scroll progress for this section — two-way: figures fill in as you scroll down and
  // return to grey (and the stat fades out) as you scroll back up
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.65'],
  })

  // Reveal text once grid is almost done
  const textOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1])
  const textY       = useTransform(scrollYProgress, [0.82, 1], [18, 0])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '130vh',
        position: 'relative',
        background: 'transparent',
        padding: '0',
      }}
    >
      <div style={{ position: 'sticky', top: '40px', padding: '56px 24px 80px' }}>
        <div className="max-w-5xl mx-auto">

          {/* Intro paragraph */}
          <p
            className="mb-10"
            style={{
              color: '#EFECE4',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
              lineHeight: 1.75,
              maxWidth: '920px', // two lines on desktop
            }}
          >
            A single homicide tells one story. But when hundreds of cases are viewed together,
            patterns begin to emerge, revealing who the victims are, the circumstances surrounding
            their deaths and the factors that shape victimisation.
          </p>

          {/* Grid: 20 cols on md+, 10 on mobile */}
          <div
            className="[grid-template-columns:repeat(10,minmax(0,1fr))] md:[grid-template-columns:repeat(20,minmax(0,1fr))]"
            style={{ display: 'grid', gap: '6px 4px', maxWidth: '900px' }}
          >
            {Array.from({ length: TOTAL_SILHOUETTES }).map((_, i) => (
              <SilhouetteCell key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>

          {/* Reveal stat */}
          <motion.p
            style={{
              opacity: textOpacity,
              y: textY,
              marginTop: '28px',
              color: '#FFBE2A',
              fontWeight: 800,
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              letterSpacing: '-0.01em',
            }}
          >
            78% of the victims were men, only 22% were women.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
