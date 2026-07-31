// ─── QUESTIONNAIRE ────────────────────────────────────────────────────────────
export const questions = [
  {
    id: 1,
    question: 'Who do you think is more likely to be a homicide victim?',
    options: ['Men', 'Women'],
    correct: 0,
    dataText: '78% of homicide victims are men.',
  },
  {
    id: 2,
    question: 'Who is more likely to kill them?',
    options: ['Stranger', 'Someone they know'],
    correct: 1,
    dataText: 'Over half of all victims knew their killer.',
  },
  {
    id: 3,
    question: 'How do you think they dress?',
    options: ['Bold', 'Conservative'],
    correct: 1,
    dataText: 'Research links low-confidence presentation to stranger risk.',
  },
  {
    id: 4,
    question: 'Where do you think most homicides happen?',
    options: ['At Home', 'In Public'],
    correct: 0,
    dataText: 'The majority of intimate-partner homicides occur in the home.',
  },
]

// ─── SILHOUETTE GRID (Phase 2) ────────────────────────────────────────────────
// 78 male (blue) + 22 female (pink) = 100 silhouettes
export const MALE_COUNT  = 78
export const FEMALE_COUNT = 22
export const TOTAL_SILHOUETTES = 100

// ─── ISOTYPE — WHO KILLED THEM? ───────────────────────────────────────────────
// Counts calibrated to match offenders.png reference (blue first, then pink)
export const isotypeData = [
  { category: 'Acquaintance / Friend', male: 24, female:  5 },
  { category: 'Intimate Partners',     male:  5, female: 13 },
  { category: 'Family Members',        male: 11, female:  4 },
  { category: 'Strangers',             male: 17, female:  1 },
  { category: 'Other / Unknown',       male: 13, female:  1 },
]

// ─── WAFFLE CHART (Phase 3) — 100 boxes ───────────────────────────────────────
// Colours derived visually from Wafflechart.png
export const waffleCategories = [
  { label: 'Argument / Personal Conflicts', color: '#F5DFA0', count: 28 },
  { label: 'Gang / Organized Crime',        color: '#E8935A', count: 22 },
  { label: 'Domestic Violence',             color: '#FFBE2A', count: 16 },
  { label: 'Robbery',                       color: '#9B9B3A', count: 16 },
  { label: 'Sexual Homicide',               color: '#4E5C24', count:  8 },
  { label: 'No Motive / Unknown',           color: '#B01A1B', count: 10 },
]

// ─── BAR GRAPH (Phase 4) ─────────────────────────────────────────────────────
export const barData = [
  { label: 'Women', value: 76, color: '#FFBE2A' },
  { label: 'Men',   value: 52, color: '#E8935A' },
]

// ─── SANKEY DIAGRAM (Phase 5) ─────────────────────────────────────────────────
export const sankeyNodes = [
  // Column 0 — Familiarity
  { id: 'known',      label: 'Known offender', col: 0, pct: 76, color: '#7A4F2E' },
  { id: 'stranger',   label: 'Stranger',        col: 0, pct: 24, color: '#4E2918' },
  // Column 1 — Common Victim Types
  { id: 'intimate',   label: 'Intimate Partner', col: 1, color: '#8B5E3C' },
  { id: 'older',      label: 'Older Women',       col: 1, color: '#9B6B47' },
  { id: 'sexual_ctx', label: 'Sexual Context',    col: 1, color: '#5E3020' },
  // Column 2 — Motives / Triggers
  { id: 'separation', label: 'Upset about separation',    col: 2, color: '#E8A030' },
  { id: 'obsession',  label: 'Obsession / Stalking',      col: 2, color: '#D4901A' },
  { id: 'possessive', label: 'Possessive of partner',     col: 2, color: '#2E7D4F' },
  { id: 'jealous',    label: "Jealous of partner's life", col: 2, color: '#1E6B3E' },
  { id: 'sexual_a',   label: 'Sexual Assault',             col: 2, color: '#B01A1B' },
  { id: 'robbery',    label: 'Robbery / Mugging',          col: 2, color: '#D05038' },
  { id: 'unknown',    label: 'Unknown motive',             col: 2, color: '#4A5088' },
]

// All link values for col 0→1 sum to 100; col 1→2 sum to 100.
export const sankeyLinks = [
  // Col 0 → 1
  { source: 'known',    target: 'intimate',   value: 52 },
  { source: 'known',    target: 'older',      value:  8 },
  { source: 'known',    target: 'sexual_ctx', value: 16 },
  { source: 'stranger', target: 'sexual_ctx', value: 14 },
  { source: 'stranger', target: 'intimate',   value:  8 },
  { source: 'stranger', target: 'older',      value:  2 },
  // Col 1 → 2
  { source: 'intimate',   target: 'separation', value: 22 },
  { source: 'intimate',   target: 'obsession',  value: 15 },
  { source: 'intimate',   target: 'possessive', value: 13 },
  { source: 'intimate',   target: 'jealous',    value: 10 },
  { source: 'older',      target: 'possessive', value:  6 },
  { source: 'older',      target: 'separation', value:  4 },
  { source: 'sexual_ctx', target: 'sexual_a',   value: 15 },
  { source: 'sexual_ctx', target: 'robbery',    value: 10 },
  { source: 'sexual_ctx', target: 'unknown',    value:  5 },
]

// ─── RESEARCH SNIPPETS ────────────────────────────────────────────────────────
export const researchSnippets = {
  knownOffenders: [
    'Childhood trauma',
    'Frequent relocation / Disruption',
    'Problems in school',
    'Early alcohol use',
  ],
  strangers: [
    'Distracted and unaware of surroundings',
    'Slow, slouched walk',
    'Under substance influence',
    'Low confidence',
    'Physically frail',
  ],
}
