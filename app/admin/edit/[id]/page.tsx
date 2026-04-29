import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoById } from '@/lib/videos'
import { VideoForm } from '@/components/english-youtube-curator/VideoForm'
import { updateVideoAction } from '../../actions'

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const video = getVideoById(id)
  if (!video) notFound()

  const boundAction = updateVideoAction.bind(null, id)

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b bg-background px-4 py-3">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">← 관리자</Link>
        <span className="font-bold">영상 수정</span>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <VideoForm action={boundAction} defaultValues={video} />
      </div>
    </main>
  )
}
