'use client'

import Link from 'next/link'
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteVideoAction } from '@/app/admin/actions'
import type { Video } from '@/types/video'

const LEVEL_LABEL: Record<Video['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function AdminVideoList({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">등록된 영상이 없습니다.</p>
  }

  return (
    <div className="divide-y rounded-lg border overflow-hidden">
      {videos.map((video) => (
        <div key={video.id} className="flex items-center gap-3 bg-card px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
            alt={video.title}
            className="h-12 w-20 flex-shrink-0 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{video.title}</p>
            <p className="text-xs text-muted-foreground">
              {video.channelName} · {LEVEL_LABEL[video.level]} · {video.genre}
              {video.isKidsFriendly && ' · 👶 Kids'}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/edit/${video.id}`}>수정</Link>
            </Button>
            <DeleteButton videoId={video.id} title={video.title} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DeleteButton({ videoId, title }: { videoId: string; title: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>영상 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{title}&rdquo;을(를) 삭제할까요? 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => { await deleteVideoAction(videoId) }}
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
