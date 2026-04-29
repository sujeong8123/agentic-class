import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AdminButton } from '@/components/english-youtube-curator/AdminButton'

const LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    emoji: '🌱',
    ar: 'AR 1.0–2.0',
    youColor: 'text-yellow-500',
    cardBorder: 'border-t-4 border-yellow-400',
    titleColor: 'text-yellow-600',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    emoji: '🌿',
    ar: 'AR 2.0–3.5',
    youColor: 'text-blue-500',
    cardBorder: 'border-t-4 border-blue-400',
    titleColor: 'text-blue-600',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    emoji: '🌳',
    ar: 'AR 3.5–5.0',
    youColor: 'text-red-500',
    cardBorder: 'border-t-4 border-red-400',
    titleColor: 'text-red-600',
  },
] as const

function YoungYouTubeLogo({ youColorClass }: { youColorClass: string }) {
  return (
    <span className="text-xl font-bold">
      <span className={youColorClass}>You</span>ng
      <span className={youColorClass}>You</span>Tube
    </span>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3">
        <YoungYouTubeLogo youColorClass="text-primary" />
      </header>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold">🎉 영어 영상보며 놀자~ 🎈</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {LEVELS.map((level) => (
            <Link key={level.id} href={`/${level.id}`} aria-label={level.label}>
              <Card className={`cursor-pointer transition-shadow hover:shadow-md ${level.cardBorder}`}>
                <CardHeader>
                  <div className="text-4xl">{level.emoji}</div>
                  <CardTitle className={level.titleColor}>{level.label}</CardTitle>
                  <CardDescription>{level.ar}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <AdminButton />
    </main>
  )
}
