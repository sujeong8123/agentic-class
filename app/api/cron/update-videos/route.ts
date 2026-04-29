import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { CHANNEL_RULES } from '@/config/channels'
import { fetchLatestChannelVideos } from '@/lib/youtube'
import { getVideos, addVideo } from '@/lib/videos'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY not set' }, { status: 500 })
  }

  const existingIds = new Set(getVideos().map(v => v.youtubeId))
  const added: string[] = []
  const errors: string[] = []

  for (const rule of CHANNEL_RULES) {
    try {
      const items = await fetchLatestChannelVideos(rule.channelId, 10)

      for (const item of items) {
        if (existingIds.has(item.youtubeId)) continue

        addVideo({
          youtubeId: item.youtubeId,
          title: item.title,
          channelName: rule.channelName,
          level: rule.level,
          genre: rule.genre,
          arLevel: rule.arLevel,
          isKidsFriendly: rule.isKidsFriendly,
        })

        existingIds.add(item.youtubeId)
        added.push(item.title)
      }
    } catch {
      errors.push(rule.channelName)
    }
  }

  revalidatePath('/', 'layout')

  return NextResponse.json({
    ok: true,
    added,
    addedCount: added.length,
    errors,
    timestamp: new Date().toISOString(),
  })
}
