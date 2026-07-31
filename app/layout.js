import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = {
  title: 'What Does a Homicide Victim Really Look Like?',
  description:
    'A data-driven scrollytelling exploration of homicide victimisation patterns and the factors that shape them.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
