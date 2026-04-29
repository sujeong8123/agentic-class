import Link from 'next/link'
import { getVideos } from '@/lib/videos'
import { AdminVideoList } from '@/components/english-youtube-curator/AdminVideoList'
import { Button } from '@/components/ui/button'
import { logoutAction } from './actions'

export default function AdminPage() {
  const videos = getVideos()

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← 홈</Link>
          <span className="font-bold">🔑 엄마 관리자</span>
        </div>
        <form action={logoutAction}>
          <Button size="sm" variant="ghost" type="submit">로그아웃</Button>
        </form>
      </header>

      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">영상 목록 ({videos.length}개)</h1>
          <Button asChild>
            <Link href="/admin/add">+ 영상 추가</Link>
          </Button>
        </div>
        <AdminVideoList videos={videos} />
      </div>
    </main>
  )
}
