import Link from 'next/link'
import { VideoForm } from '@/components/english-youtube-curator/VideoForm'
import { addVideoAction } from '../actions'

export default function AddVideoPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b bg-background px-4 py-3">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">← 관리자</Link>
        <span className="font-bold">영상 추가</span>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <VideoForm action={addVideoAction} />
      </div>
    </main>
  )
}
