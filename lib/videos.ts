import fs from 'fs'
import path from 'path'
import type { Video, VideoInput } from '@/types/video'

const DATA_FILE = path.join(process.cwd(), 'data', 'videos.json')

function readVideos(): Video[] {
  const data = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(data) as Video[]
}

function writeVideos(videos: Video[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2))
}

export function extractYoutubeId(url: string): string | null {
  const pattern = /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(pattern)
  return match ? match[1] : null
}

export function getVideos(): Video[] {
  return readVideos()
}

export function getVideosByLevel(level: Video['level']): Video[] {
  return readVideos().filter(v => v.level === level).slice(0, 20)
}

export function getReadAloudVideos(level: Video['level']): Video[] {
  return readVideos()
    .filter(v => v.level === level && v.title.toLowerCase().includes('read aloud'))
    .sort((a, b) => (a.arLevel ?? Infinity) - (b.arLevel ?? Infinity))
    .slice(0, 12)
}

export function getVideoById(id: string): Video | null {
  return readVideos().find(v => v.id === id) ?? null
}

export function addVideo(input: VideoInput): Video {
  const videos = readVideos()
  const video: Video = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeVideos([...videos, video])
  return video
}

export function updateVideo(id: string, input: Partial<VideoInput>): Video | null {
  const videos = readVideos()
  const idx = videos.findIndex(v => v.id === id)
  if (idx === -1) return null
  videos[idx] = { ...videos[idx], ...input }
  writeVideos(videos)
  return videos[idx]
}

export function deleteVideo(id: string): boolean {
  const videos = readVideos()
  const filtered = videos.filter(v => v.id !== id)
  if (filtered.length === videos.length) return false
  writeVideos(filtered)
  return true
}
