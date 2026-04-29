'use client'

interface YoutubePlayerProps {
  youtubeId: string
  title: string
}

export function YoutubePlayer({ youtubeId, title }: YoutubePlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
        data-testid="youtube-iframe"
      />
    </div>
  )
}
