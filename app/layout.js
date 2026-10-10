import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800'],
})

// Hero title
const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['500'],
  style: ['normal', 'italic'], // italic is used by the hero's drag hint
})

export const metadata = {
  title: 'What Does a Homicide Victim Really Look Like?',
  description:
    'A data-driven scrollytelling exploration of homicide victimisation patterns and the factors that shape them.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
