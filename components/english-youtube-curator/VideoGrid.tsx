'use client'

import { useEffect, useMemo, useState } from 'react'
import { GenreFilter, type Genre } from './GenreFilter'
import { VideoCard } from './VideoCard'
import type { Video } from '@/types/video'

interface VideoGridProps {
  videos: Video[]
  readAloudVideos: Video[]
  level: string
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function VideoGrid({ videos, readAloudVideos, level }: VideoGridProps) {
  const [activeGenre, setActiveGenre] = useState<Genre>('all')

  const merged = useMemo(() => {
    const map = new Map<string, Video>()
    for (const v of [...videos, ...readAloudVideos]) map.set(v.id, v)
    return Array.from(map.values())
  }, [videos, readAloudVideos])

  // 서버 렌더 시에는 원본 순서, 클라이언트 마운트 후에만 셔플 (hydration mismatch 방지)
  const [allShuffled, setAllShuffled] = useState<Video[]>(merged)
  useEffect(() => {
    setAllShuffled(shuffle(merged))
  }, [merged])

  const filtered = useMemo(() => {
    if (activeGenre === 'all') return allShuffled.slice(0, 20)
    if (activeGenre === 'read-aloud') return readAloudVideos
    return videos.filter((v) => v.genre === activeGenre).slice(0, 20)
  }, [activeGenre, videos, readAloudVideos, allShuffled])

  return (
    <div className="space-y-4">
      <GenreFilter active={activeGenre} onChange={setActiveGenre} />
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">영상이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} level={level} />
          ))}
        </div>
      )}
    </div>
  )
}
