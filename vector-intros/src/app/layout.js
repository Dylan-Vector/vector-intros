import './globals.css'

export const metadata = {
  title: 'Vector - Candidate Intro Generator',
  description: 'Precision hiring for AI & Infrastructure companies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
