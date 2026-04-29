'use client'

import { useState } from 'react'
import { GenreFilter, type Genre } from './GenreFilter'
import { VideoCard } from './VideoCard'
import type { Video } from '@/types/video'

interface VideoGridProps {
  videos: Video[]
  level: string
}

export function VideoGrid({ videos, level }: VideoGridProps) {
  const [activeGenre, setActiveGenre] = useState<Genre>('all')

  const filtered =
    activeGenre === 'all' ? videos : videos.filter((v) => v.genre === activeGenre)

  return (
    <div className="space-y-4">
      <GenreFilter active={activeGenre} onChange={setActiveGenre} />
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">영상이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} level={level} />
          ))}
        </div>
      )}
    </div>
  )
}
