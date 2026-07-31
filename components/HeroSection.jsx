'use client'

// ── Polaroid with Figma image assets ─────────────────────────────────────────
function Polaroid({ style, photoSrc, pinSrc, pinRotate = 0, frameRotate = 0 }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...style,
        transform: `rotate(${frameRotate}deg)`,
      }}
    >
      {/* Push pin image from Figma */}
      <img
        src={pinSrc}
        alt=""
        style={{
          position: 'absolute',
          top: '-13%',
          left: '50%',
          width: '30%',
          transform: `translateX(-50%) rotate(${pinRotate}deg)`,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
      {/* Polaroid photo — SVG from Figma already includes frame + silhouette */}
      <img
        src={photoSrc}
        alt=""
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          boxShadow: '0 8px 28px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  )
}

// ── Pin SVG (for string overlay) ──────────────────────────────────────────────
function Pin({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="10" fill="#9B1818" />
      <circle cx={cx} cy={cy} r="6"  fill="#C42020" />
      <circle cx={cx - 2.5} cy={cy - 2.5} r="2.5" fill="rgba(255,255,255,0.35)" />
    </g>
  )
}

// ── Hero Section ──────────────────────────────────────────────────────────────
// All coordinates are in a 1200 × 500 design space that scales with the container.
// Photo positions (left, top, width) as fractions of 1200 × 500.
// Polaroid aspect ratio (inner photo) ≈ 0.82, plus 6px sides and 26px bottom.

export default function HeroSection() {
  // Pin coordinates in the 1200×500 SVG space
  const PIN = {
    p1: { x: 242, y: 218 }, // upper-right area of Photo 1
    p2: { x: 394, y: 6   }, // top-center of Photo 2
    p3: { x: 810, y: 6   }, // top-center of Photo 3
    p4: { x: 962, y: 218 }, // upper-left area of Photo 4
  }

  return (
    <section
      style={{
        background: 'linear-gradient(to bottom, #181818 0%, #0e0e0e 55%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* ── Aspect-ratio box: keeps layout proportional at all widths ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '41.7%', /* 500/1200 */
          minHeight: '340px',
        }}
      >
        {/* ── String + Pin overlay (SVG) ── */}
        <svg
          viewBox="0 0 1200 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
        >
          {/* Main string: left edge → P1 → continues to P3 (goes UP-RIGHT, the long diagonal) */}
          <path
            d={`M -20 400 Q 80 310 ${PIN.p1.x} ${PIN.p1.y}`}
            stroke="#8B1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round"
          />
          {/* Cross string 1: P1 → P3 (long diagonal upward-right) */}
          <path
            d={`M ${PIN.p1.x} ${PIN.p1.y} Q 520 80 ${PIN.p3.x} ${PIN.p3.y}`}
            stroke="#8B1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round"
          />
          {/* Cross string 2: P2 → P4 (long diagonal downward-right) */}
          <path
            d={`M ${PIN.p2.x} ${PIN.p2.y} Q 680 110 ${PIN.p4.x} ${PIN.p4.y}`}
            stroke="#8B1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round"
          />
          {/* String: P3 → right edge */}
          <path
            d={`M ${PIN.p3.x} ${PIN.p3.y} Q 1000 110 1220 360`}
            stroke="#8B1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round"
          />

          {/* Pins */}
          <Pin cx={PIN.p1.x} cy={PIN.p1.y} />
          <Pin cx={PIN.p2.x} cy={PIN.p2.y} />
          <Pin cx={PIN.p3.x} cy={PIN.p3.y} />
          <Pin cx={PIN.p4.x} cy={PIN.p4.y} />
        </svg>

        {/* ── Photo 1: Female silhouette — bottom-left, large, rotated left ── */}
        <Polaroid
          style={{ left: '2%', top: '28%', width: '17%', zIndex: 5 }}
          photoSrc="/assets/polaroid-female.svg"
          pinSrc="/assets/pin.png"
          pinRotate={-5}
          frameRotate={-18}
        />

        {/* ── Photo 2: Knife — upper center-left, slight tilt ── */}
        <Polaroid
          style={{ left: '27%', top: '-4%', width: '14%', zIndex: 5 }}
          photoSrc="/assets/polaroid-knife-2.svg"
          pinSrc="/assets/pin2.png"
          pinRotate={8}
          frameRotate={-5.5}
        />

        {/* ── Photo 3: Male silhouette — upper center-right, slight tilt ── */}
        <Polaroid
          style={{ left: '60%', top: '-2%', width: '13%', zIndex: 5 }}
          photoSrc="/assets/polaroid-male.svg"
          pinSrc="/assets/pin4.png"
          pinRotate={-28}
          frameRotate={-4.5}
        />

        {/* ── Photo 4: Bootprints — right side, tilted right ── */}
        <Polaroid
          style={{ right: '1%', top: '8%', width: '19%', zIndex: 5 }}
          photoSrc="/assets/polaroid-boot.svg"
          pinSrc="/assets/pin3.png"
          pinRotate={-15}
          frameRotate={8.9}
        />

        {/* ── Title — centered per Figma node 211:8781 ── */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: '36%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 8,
          }}
        >
          <h1
            style={{
              color: '#DDDAC9',
              fontWeight: 800,
              fontSize: 'clamp(1.1rem, 2.2vw, 2rem)',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            What does a homicide
            <br />victim really look like?
          </h1>
        </div>
      </div>
    </section>
  )
}
