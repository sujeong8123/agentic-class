import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const LEVELS = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', ar: 'AR 1.0–2.0' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🌿', ar: 'AR 2.0–3.5' },
  { id: 'advanced', label: 'Advanced', emoji: '🌳', ar: 'AR 3.5–5.0' },
] as const

export default function HomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3">
        <span className="text-xl font-bold">YoungYouTube</span>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold">레벨을 선택하세요</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {LEVELS.map((level) => (
            <Link key={level.id} href={`/${level.id}`} aria-label={level.label}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="text-4xl">{level.emoji}</div>
                  <CardTitle>{level.label}</CardTitle>
                  <CardDescription>{level.ar}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
