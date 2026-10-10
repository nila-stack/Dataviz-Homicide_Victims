'use client'

// ── Hero — rebuilt from Figma (FINAL › MAIN MAIN PAGE, nodes 299:439–299:918) ──
// Every value below is in Figma's 1920px-wide frame space and converted to a
// percentage of the hero box, so the layout is exact at 1920px and scales
// proportionally at every other width.
//
// Polaroids can be picked up and dragged. Each photo moves together with its pin,
// the strings attached to that pin follow it, and the photo is tethered to its
// spot on the string so it can't be pulled off. Released photos spring back, with
// a paper-flick sound on pick-up and release.

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

const FW = 1920          // Figma frame width
const TOP = 120          // extra space above the frame so the top polaroids aren't cut
const BOTTOM = 778       // Figma y where the hero ends (questionnaire intro sits at 842)
const FH = TOP + BOTTOM  // hero height in design units

const FRAME = '#DDDAC9'
const PANEL = '#100102'
const STRING = '#B01A1B'

const TETHER = 80        // how far (design px) a polaroid can be pulled from its pinned spot

// Title metrics (design px at 1920 wide), measured from the reference screenshot
const TITLE_SIZE = 52
const TITLE_TOP = 568    // top of the first line box; tuned so the first baseline lands at y 624

const pct = (v) => `${(v * 100).toFixed(4)}%`

// Box of size w×h centred on (cx, cy) in Figma coordinates
const placeAt = (cx, cy, w, h) => ({
  position: 'absolute',
  left: pct((cx - w / 2) / FW),
  top: pct((cy - h / 2 + TOP) / FH),
  width: pct(w / FW),
  height: pct(h / FH),
})

// Polaroid frame 240.347 × 327.125 with a 221.94 × 308.191 panel inset 9.47px
const POLAROID_W = 240.347
const POLAROID_H = 327.125
const PANEL_INSET = { left: '3.9401%', top: '2.8940%', width: '92.3418%', height: '94.2120%' }

// Parts of a polaroid you can grab
const GRAB = { pointerEvents: 'auto', cursor: 'grab', touchAction: 'none', userSelect: 'none' }

// ── Strings: 6px straight lines, start → end in Figma coordinates ─────────────
const LINES = {
  pin1ToKnife:  [291, 409, 712, 84],                // Line 157 — behind the knife polaroid
  topToBoot:    [700.2, -130, 1639, 386],           // Line 162 — extended up through the top gap
  leftToPin1:   [-120, 369.316, 279, 407],          // Line 161
  bootToTopRt:  [2020.949, -154, 1646, 399],        // Line 154
  rightToBoot:  [2062.301, 527.295, 1659, 380],     // Line 158
  maleToPin1:   [1361, 90, 291, 397],               // Line 156 — on top of everything
  // From the reference screenshot: mirror-image strings rising from the knife and man pins
  // to the top edge (dx/dy = ±0.684), drawn over both polaroids
  knifeToTop:   [565.6, -130, 712, 84],
  maleToTop:    [1511.5, -130, 1361, 90],
}

// A string whose ends can be attached to a dragged polaroid.
// `from` / `to` are that polaroid's drag offset (px); `unit` converts px → design units.
function RedString({ line, from, to, unit }) {
  const [x1, y1, x2, y2] = line
  const zero = useMotionValue(0)
  const fx = from?.x ?? zero, fy = from?.y ?? zero
  const tx = to?.x ?? zero, ty = to?.y ?? zero
  const X1 = useTransform([fx, unit], ([v, u]) => x1 + v * u)
  const Y1 = useTransform([fy, unit], ([v, u]) => y1 + v * u)
  const X2 = useTransform([tx, unit], ([v, u]) => x2 + v * u)
  const Y2 = useTransform([ty, unit], ([v, u]) => y2 + v * u)
  return (
    <svg
      viewBox={`0 ${-TOP} ${FW} ${FH}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
    >
      <motion.line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={STRING} strokeWidth="6" />
    </svg>
  )
}

// ── Polaroid sound: synthesised paper (Web Audio — no audio file to load) ─────
// Paper sounds are dozens of tiny crackles, not a single tone, so each sound is built
// from short noise "grains" with random timing and loudness, then filtered to the
// papery 1–8 kHz range. A fresh buffer is made per play with a slightly different
// pitch, so no two grabs sound identical. The audio context starts on the first grab,
// which counts as a user gesture, so browsers allow it.
let audioCtx = null

function paper({ length, grains, grainMs, swoosh = 0, low, high, gain }) {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  audioCtx ??= new AC()
  if (audioCtx.state === 'suspended') audioCtx.resume()

  const rate = audioCtx.sampleRate
  const len = Math.floor(rate * length)
  const buf = audioCtx.createBuffer(1, len, rate)
  const d = buf.getChannelData(0)

  // Crackle grains: short, sharp bursts scattered through the sound, thinning out at the end
  for (let g = 0; g < grains; g++) {
    const at = Math.floor(len * Math.pow(Math.random(), 1.6))
    const dur = Math.floor(rate * (grainMs[0] + Math.random() * (grainMs[1] - grainMs[0])) / 1000)
    const amp = 0.35 + Math.random() * 0.65
    for (let i = 0; i < dur && at + i < len; i++) d[at + i] += (Math.random() * 2 - 1) * amp * Math.exp(-i / (dur / 4))
  }
  // Optional soft "swoosh" body underneath (the sheet moving through air)
  if (swoosh) {
    for (let i = 0; i < len; i++) {
      const t = i / len
      d[i] += (Math.random() * 2 - 1) * swoosh * Math.sin(Math.PI * Math.min(1, t * 2.5)) * (1 - t)
    }
  }

  const t0 = audioCtx.currentTime
  const src = audioCtx.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = 0.9 + Math.random() * 0.2
  const hp = audioCtx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = low
  const lp = audioCtx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = high
  const amp = audioCtx.createGain()
  amp.gain.value = gain
  src.connect(hp).connect(lp).connect(amp).connect(audioCtx.destination)
  src.start(t0)
}

// Lifting a photo off the board: a quick, crisp crinkle
const pickUpSound = () => paper({ length: 0.16, grains: 14, grainMs: [2, 9], low: 1800, high: 9000, gain: 0.28 })
// Letting go: a soft paper flap as it swings back, with a few crackles
const releaseSound = () => paper({ length: 0.28, grains: 9, grainMs: [3, 14], swoosh: 0.25, low: 900, high: 6500, gain: 0.32 })

// Moves its children by a shared drag offset, so a polaroid and its pin (which sit on
// different layers) travel together. Grabbing either one drags both; on release the
// photo springs back to its pinned spot.
function Draggable({ offset, limit, children }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={{ left: -limit, right: limit, top: -limit, bottom: limit }}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 500, bounceDamping: 10 }}
      onDragStart={pickUpSound}
      onDragEnd={releaseSound}
      whileDrag={{ cursor: 'grabbing' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', x: offset.x, y: offset.y }}
    >
      {children}
    </motion.div>
  )
}

// ── Sway: hovering a polaroid makes it swing on its pin like a hanging photo ──
// The wrapper covers the hero and rotates around the pin's point, so only the photo
// moves while the pin stays put. It swings first in the direction the pointer was
// moving, then settles with smaller and smaller sways (a damped pendulum).
const SWAY = [0, 6, -4.2, 2.8, -1.7, 0.9, -0.4, 0]
function Sway({ pin, children }) {
  const rotate = useMotionValue(0)
  const swaying = useRef(false)
  const onMouseEnter = (e) => {
    if (swaying.current) return // let a swing finish before starting another
    swaying.current = true
    const dir = e.movementX < 0 ? -1 : 1
    animate(rotate, SWAY.map((a) => a * dir), {
      duration: 2.2,
      ease: 'easeInOut',
      onComplete: () => { swaying.current = false },
    })
  }
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        rotate,
        transformOrigin: `${pct(pin[0] / FW)} ${pct((pin[1] + TOP) / FH)}`,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Push pin: Figma crops a 69 × 88 window out of the 1200 × 1200 pin.png ─────
function Pin({ cx, cy, rotate }) {
  return (
    <div style={{ ...placeAt(cx, cy, 69.009, 88.006), ...GRAB, transform: `rotate(${rotate}deg)`, overflow: 'hidden' }}>
      <img
        src="/assets/pin.png"
        alt=""
        draggable={false}
        style={{ position: 'absolute', left: '-117.98%', top: '-83.04%', width: '337.08%', height: '264.32%', maxWidth: 'none' }}
      />
    </div>
  )
}

// ── Polaroid: cream frame + dark panel + artwork placed in panel-local % ──────
// art: { src, left, top, width, height, rotate } — percentages of the panel
function Polaroid({ cx, cy, rotate, art = [], clip = false }) {
  return (
    <div style={{ ...placeAt(cx, cy, POLAROID_W, POLAROID_H), ...GRAB, transform: `rotate(${rotate}deg)`, background: FRAME }}>
      <div style={{ position: 'absolute', ...PANEL_INSET, background: PANEL, overflow: clip ? 'hidden' : 'visible' }}>
        {art.map((a) => (
          <img
            key={a.src}
            src={a.src}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: `${a.left}%`,
              top: `${a.top}%`,
              width: `${a.width}%`,
              height: `${a.height}%`,
              maxWidth: 'none',
              transform: `rotate(${a.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(FW)
  const unit = useMotionValue(1) // design units per screen px

  useEffect(() => {
    const el = boxRef.current
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width || FW
      setWidth(w)
      unit.set(FW / w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [unit])

  const limit = (TETHER * width) / FW
  const female = { x: useMotionValue(0), y: useMotionValue(0) }
  const knife = { x: useMotionValue(0), y: useMotionValue(0) }
  const boot = { x: useMotionValue(0), y: useMotionValue(0) }
  const male = { x: useMotionValue(0), y: useMotionValue(0) }

  return (
    // Clip only sideways (strings run off the left/right edges). Vertically the polaroids may
    // hang over the edge while dragged, and zIndex keeps them above the next section.
    <section style={{ position: 'relative', zIndex: 1, overflowX: 'clip', overflowY: 'visible', width: '100%' }}>
      <div
        ref={boxRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${FW} / ${FH}`,
          containerType: 'inline-size',
        }}
      >
        {/* Layer order follows Figma, bottom → top */}
        <RedString line={LINES.pin1ToKnife} from={female} to={knife} unit={unit} />

        {/* Female — the SVG already contains frame, panel and silhouette */}
        <Draggable offset={female} limit={limit}>
          <Sway pin={[291.43, 405.52]}>
            <img
              src="/assets/polaroid-female.svg"
              alt=""
              draggable={false}
              style={{ ...placeAt(324.4, 565.33, POLAROID_W, POLAROID_H), ...GRAB, transform: 'rotate(-18.03deg)', maxWidth: 'none' }}
            />
          </Sway>
          <Pin cx={291.43} cy={405.52} rotate={-13.47} />
        </Draggable>

        {/* Knife + blood splatter */}
        <Draggable offset={knife} limit={limit}>
          <Sway pin={[715, 79.19]}>
            <Polaroid
              cx={724.35}
              cy={243.1}
              rotate={-5.51}
              art={[
                { src: '/assets/polaroid-knife-1.svg', left: -3.536, top: 14.113, width: 106.724, height: 71.759, rotate: 98.77 },
                { src: '/assets/polaroid-knife-2.svg', left: 6.065, top: 15.345, width: 86.246, height: 81.671, rotate: -161.52 },
              ]}
            />
          </Sway>
          <Pin cx={715} cy={79.19} rotate={-14.36} />
        </Draggable>

        {/* Bootprints — the pin sits above Line 154, so it lives on its own layer */}
        <Draggable offset={boot} limit={limit}>
          <Sway pin={[1650.88, 391.13]}>
            <Polaroid
              cx={1631.33}
              cy={555.6}
              rotate={8.89}
              art={[{ src: '/assets/polaroid-boot.svg', left: 10.261, top: 10.781, width: 83.767, height: 77.868, rotate: 4.35 }]}
            />
          </Sway>
        </Draggable>
        <RedString line={LINES.bootToTopRt} to={boot} unit={unit} />
        <Draggable offset={boot} limit={limit}>
          <Pin cx={1650.88} cy={391.13} rotate={-21.59} />
        </Draggable>

        <RedString line={LINES.rightToBoot} to={boot} unit={unit} />
        <RedString line={LINES.topToBoot} to={boot} unit={unit} />
        <RedString line={LINES.leftToPin1} to={female} unit={unit} />

        {/* Title — DM Mono Medium, line-height 1.5, centred, broken after "victim"
            (matched to the reference screenshot: first baseline at Figma y 624). */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: pct((TITLE_TOP + TOP) / FH),
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              margin: 0,
              color: FRAME,
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontWeight: 500,
              fontSize: `${(TITLE_SIZE / FW) * 100}cqw`,
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            What does a homicide victim
            <br />
            really look like?
          </h1>
        </div>

        {/* Drag hint: always visible, centred under the bootprint polaroid
            (photo centre x 1631, lowest corner y ≈ 736 in the 1920 frame); 17px italic at 1920 wide */}
        <p
          style={{
            position: 'absolute',
            left: pct(1631 / FW),
            top: pct((750 + TOP) / FH),
            transform: 'translateX(-50%)',
            margin: 0,
            color: FRAME,
            opacity: 0.6,
            fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
            fontWeight: 500,
            fontStyle: 'italic',
            fontSize: `max(9px, ${(17 / FW) * 100}cqw)`,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Pull and drag the polaroids
        </p>

        {/* Male — silhouette is masked to the dark panel */}
        <Draggable offset={male} limit={limit}>
          <Sway pin={[1359.45, 83.93]}>
            <Polaroid
              cx={1355.2}
              cy={246.22}
              rotate={-4.56}
              clip
              art={[{ src: '/assets/polaroid-male.svg', left: -7.912, top: 11.018, width: 118.428, height: 89.875, rotate: -0.45 }]}
            />
          </Sway>
          <Pin cx={1359.45} cy={83.93} rotate={-33.66} />
        </Draggable>

        <RedString line={LINES.maleToPin1} from={male} to={female} unit={unit} />
        <RedString line={LINES.knifeToTop} to={knife} unit={unit} />
        <RedString line={LINES.maleToTop} to={male} unit={unit} />
      </div>
    </section>
  )
}
