import type { Video } from '@/types/video'
import { VideoCard } from './VideoCard'

interface ReadAloudSectionProps {
  videos: Video[]
  level: string
}

export function ReadAloudSection({ videos, level }: ReadAloudSectionProps) {
  return (
    <section>
      <div className="mb-4 border-t pt-8">
        <h2 className="text-lg font-semibold">📖 Read Aloud</h2>
        <p className="mt-1 text-sm text-muted-foreground">AR지수 순 · 최대 8편</p>
      </div>
      {videos.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">준비 중이에요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} level={level} />
          ))}
        </div>
      )}
    </section>
  )
}
