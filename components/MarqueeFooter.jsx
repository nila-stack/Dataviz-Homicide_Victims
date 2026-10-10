'use client'

const TAPE_TEXT = 'DO NOT CROSS • CRIME SCENE • DO NOT CROSS • CRIME SCENE • '
const REPEAT    = 8

export default function MarqueeFooter() {
  const strip = TAPE_TEXT.repeat(REPEAT)

  return (
    // 64px bottom padding = 50px clear below the tilted bottom tape's lowest corner (it dips ~14px)
    <footer style={{ marginTop: '33px', paddingBottom: '64px', overflow: 'hidden' }}> {/* 48 − 15 */}
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-left 22s linear infinite;
          will-change: transform;
        }
        .marquee-track-rev {
          display: flex;
          width: max-content;
          animation: marquee-left 28s linear infinite reverse;
          will-change: transform;
        }
      `}</style>

      {/* Strip 1 — left to right */}
      <div
        style={{
          background: '#FFBE2A',
          overflow: 'hidden',
          transform: 'rotate(-1.5deg) scaleX(1.04)',
          marginBottom: '-4px',
          padding: '10px 0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <div className="marquee-track">
          <span
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              paddingRight: '4px',
            }}
          >
            {strip}
          </span>
          <span
            aria-hidden="true"
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {strip}
          </span>
        </div>
      </div>

      {/* Strip 2 — reversed direction */}
      <div
        style={{
          background: '#FFBE2A',
          overflow: 'hidden',
          transform: 'rotate(1.5deg) scaleX(1.04)',
          padding: '10px 0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <div className="marquee-track-rev">
          <span
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              paddingRight: '4px',
            }}
          >
            {strip}
          </span>
          <span
            aria-hidden="true"
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {strip}
          </span>
        </div>
      </div>

      {/* Strip 3 — forward again */}
      <div
        style={{
          background: '#FFBE2A',
          overflow: 'hidden',
          transform: 'rotate(-0.8deg) scaleX(1.04)',
          marginTop: '-4px',
          padding: '10px 0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
        }}
      >
        <div className="marquee-track" style={{ animationDuration: '18s', animationDelay: '-6s' }}>
          <span
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              paddingRight: '4px',
            }}
          >
            {strip}
          </span>
          <span
            aria-hidden="true"
            style={{
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {strip}
          </span>
        </div>
      </div>
    </footer>
  )
}
