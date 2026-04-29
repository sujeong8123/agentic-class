import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideosByLevel } from '@/lib/videos'
import { VideoGrid } from '@/components/english-youtube-curator/VideoGrid'
import type { Video } from '@/types/video'

const VALID_LEVELS: Video['level'][] = ['beginner', 'intermediate', 'advanced']

const LEVEL_LABELS: Record<Video['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  if (!VALID_LEVELS.includes(level as Video['level'])) notFound()

  const videos = getVideosByLevel(level as Video['level'])

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← 홈
        </Link>
        <span className="font-bold">{LEVEL_LABELS[level as Video['level']]}</span>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <VideoGrid videos={videos} level={level} />
      </div>
    </main>
  )
}
