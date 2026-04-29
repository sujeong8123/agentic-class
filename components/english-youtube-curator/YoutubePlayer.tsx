'use client'

import { useEffect, useState } from 'react'

interface YoutubePlayerProps {
  youtubeId: string
  title: string
}

export function YoutubePlayer({ youtubeId, title }: YoutubePlayerProps) {
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return
      try {
        const data = JSON.parse(e.data)
        // YouTube IFrame API: info === 0 은 종료, info === 1 은 재생
        if (data.event === 'onStateChange') {
          if (data.info === 0) setEnded(true)
          else setEnded(false)
        }
      } catch {
        // 파싱 실패는 무시
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        // allow-popups, allow-top-navigation 제외 → 새 탭/창 열기 및 상위 페이지 이동 차단
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-fullscreen"
        className="h-full w-full border-0"
        data-testid="youtube-iframe"
      />

      {/* 영상 종료 후 End Screen 카드 클릭 차단 오버레이 */}
      {ended && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <p className="text-lg font-semibold text-white">🎉 영상이 끝났어요!</p>
        </div>
      )}
    </div>
  )
}
