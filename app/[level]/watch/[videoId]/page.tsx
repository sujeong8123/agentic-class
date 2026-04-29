import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoById } from '@/lib/videos'
import { YoutubePlayer } from '@/components/english-youtube-curator/YoutubePlayer'
import { KeySentences } from '@/components/english-youtube-curator/KeySentences'

export default async function WatchPage({
  params,
}: {
  params: Promise<{ level: string; videoId: string }>
}) {
  const { level, videoId } = await params
  const video = getVideoById(videoId)
  if (!video) notFound()

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3">
        <Link
          href={`/${level}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← 목록으로
        </Link>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <YoutubePlayer youtubeId={video.youtubeId} title={video.title} />
        <div>
          <h1 className="text-lg font-semibold">{video.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{video.channelName}</p>
        </div>
        {video.sentences && video.sentences.length > 0 && (
          <KeySentences sentences={video.sentences} />
        )}
      </div>
    </main>
  )
}
