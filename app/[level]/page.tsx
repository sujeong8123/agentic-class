import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideosByLevel, getReadAloudVideos } from '@/lib/videos'
import { VideoGrid } from '@/components/english-youtube-curator/VideoGrid'
import type { Video } from '@/types/video'

const VALID_LEVELS: Video['level'][] = ['beginner', 'intermediate', 'advanced']

const LEVEL_CONFIG: Record<Video['level'], { label: string; youColor: string }> = {
  beginner:     { label: 'Beginner',     youColor: 'text-yellow-500' },
  intermediate: { label: 'Intermediate', youColor: 'text-blue-500'   },
  advanced:     { label: 'Advanced',     youColor: 'text-red-500'    },
}

function YoungYouTubeLogo({ youColorClass }: { youColorClass: string }) {
  return (
    <span className="text-xl font-bold">
      <span className={youColorClass}>You</span>ng
      <span className={youColorClass}>You</span>Tube
    </span>
  )
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  if (!VALID_LEVELS.includes(level as Video['level'])) notFound()

  const config = LEVEL_CONFIG[level as Video['level']]
  const videos = getVideosByLevel(level as Video['level'])
  const readAloudVideos = getReadAloudVideos(level as Video['level'])

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← 홈
        </Link>
        <YoungYouTubeLogo youColorClass={config.youColor} />
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <VideoGrid videos={videos} readAloudVideos={readAloudVideos} level={level} />
      </div>
    </main>
  )
}
