import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Video } from '@/types/video'

interface VideoCardProps {
  video: Video
  level: string
}

export function VideoCard({ video, level }: VideoCardProps) {
  return (
    <Link href={`/${level}/watch/${video.id}`} aria-label={video.title}>
      <div className="group rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-video bg-muted">
          <Image
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover"
            unoptimized
          />
          {video.isKidsFriendly && (
            <span className="absolute top-2 left-2">
              <Badge variant="secondary">Kids</Badge>
            </span>
          )}
          {video.duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
              {video.duration}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{video.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{video.channelName}</p>
          <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            AR {video.arLevel}
          </span>
        </div>
      </div>
    </Link>
  )
}
