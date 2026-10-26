// ── Sources ─────────────────────────────────────────────────────────────────────

const SOURCES = [
  {
    name: 'UNODC, Global Study on Homicide 2023',
    url: 'https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html',
    used: 'Quiz questions 5 and 6, "Who gets justice?", "While you’ve been reading" (2021 data)',
  },
  {
    name: 'UNODC, Global Study on Homicide 2023, Chapter 5: criminal justice response',
    url: 'https://www.unodc.org/documents/data-and-analysis/gsh/2023/GSH23_Chapter_5.pdf',
    used: 'Convictions per 10 victims in "Who gets justice?"',
  },
  {
    name: 'UNODC, "52 people lost their lives to homicide globally every hour in 2021"',
    url: 'https://unodc.org/unodc/press/releases/2023/December/fifty-two-people-lost-their-lives-to-homicide-globally-every-hour-in-2021--says-new-report-from-unodc.html',
    used: 'Homicide rate in "While you’ve been reading"',
  },
  {
    name: 'UN Women & UNODC, Femicides in 2023: Global estimates of intimate partner/family member femicides',
    url: 'https://www.unwomen.org/en/digital-library/publications/2024/11/femicides-in-2023-global-estimates-of-intimate-partner-family-member-femicides',
    used: '"While you’ve been reading" (2023 data)',
  },
  {
    name: 'UN News, "One woman killed every 10 minutes"',
    url: 'https://news.un.org/en/story/2024/11/1157386',
    used: 'Femicide context (2023 data)',
  },
  {
    name: 'National Crime Records Bureau (NCRB), Crime in India 2022',
    url: 'https://www.ncrb.gov.in/',
    used: '"Closer to home" (2022 data)',
  },
]

export default function SourcesSection() {
  return (
    // Last thing on the page: 50px shorter than before (tighter padding, gaps and line height)
    <footer style={{ padding: '32px 24px 45px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto">
        <h2 style={{ color: '#FFBE2A', fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '12px' }}>
          Sources
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {SOURCES.map((s) => (
            <li key={s.name} style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: 'rgba(239,236,228,0.7)' }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ color: '#EFECE4', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {s.name}
              </a>
              <span style={{ color: 'rgba(239,236,228,0.5)' }}> · {s.used}</span>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '12px', fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(239,236,228,0.45)', maxWidth: '760px' }}>
          Figures come from different years (2021 to 2023) and from countries that report data, so global and
          regional numbers are estimates.
        </p>
      </div>
    </footer>
  )
}
