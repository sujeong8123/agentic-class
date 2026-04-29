import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import type { Video } from '@/types/video'
import {
  extractYoutubeId,
  getVideosByLevel,
  addVideo,
  deleteVideo,
} from './videos'

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}))

const mockVideos: Video[] = [
  {
    id: 'id-001',
    youtubeId: 'abc123',
    title: 'Beginner Story 1',
    channelName: 'Test Channel',
    level: 'beginner',
    genre: 'story',
    isKidsFriendly: true,
    arLevel: 1.2,
    duration: '3:00',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'id-002',
    youtubeId: 'def456',
    title: 'Beginner Song 1',
    channelName: 'Test Channel',
    level: 'beginner',
    genre: 'song',
    isKidsFriendly: false,
    arLevel: 1.0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'id-003',
    youtubeId: 'ghi789',
    title: 'Advanced Story 1',
    channelName: 'Test Channel',
    level: 'advanced',
    genre: 'story',
    isKidsFriendly: false,
    arLevel: 4.5,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

const manyBeginnerVideos: Video[] = Array.from({ length: 12 }, (_, i) => ({
  id: `bid-${i}`,
  youtubeId: `yt${i}`,
  title: `Beginner ${i}`,
  channelName: 'Ch',
  level: 'beginner' as const,
  genre: 'story' as const,
  isKidsFriendly: true,
  arLevel: 1.0,
  createdAt: '2024-01-01T00:00:00.000Z',
}))

function setupMock(videos: Video[]) {
  vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(videos) as unknown as Buffer)
  vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)
}

beforeEach(() => {
  vi.clearAllMocks()
  setupMock(mockVideos)
})

describe('extractYoutubeId', () => {
  it('extracts id from watch URL', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts id from youtu.be short URL', () => {
    expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts id from embed URL', () => {
    expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for invalid URL', () => {
    expect(extractYoutubeId('https://vimeo.com/123456')).toBeNull()
  })
})

describe('getVideosByLevel', () => {
  it('returns only videos of the specified level', () => {
    const result = getVideosByLevel('beginner')
    expect(result.every(v => v.level === 'beginner')).toBe(true)
    expect(result.length).toBe(2)
  })

  it('caps results at 10 even when more exist', () => {
    setupMock(manyBeginnerVideos)
    const result = getVideosByLevel('beginner')
    expect(result.length).toBe(10)
  })
})

describe('addVideo', () => {
  it('appends new video and writes file', () => {
    const input = {
      youtubeId: 'newId',
      title: 'New Video',
      channelName: 'New Channel',
      level: 'intermediate' as const,
      genre: 'science' as const,
      isKidsFriendly: false,
      arLevel: 2.5,
    }
    const newVideo = addVideo(input)
    expect(newVideo.id).toBeDefined()
    expect(newVideo.title).toBe('New Video')
    expect(fs.writeFileSync).toHaveBeenCalledOnce()
    const written = JSON.parse(
      vi.mocked(fs.writeFileSync).mock.calls[0][1] as string
    ) as Video[]
    expect(written.some(v => v.id === newVideo.id)).toBe(true)
  })
})

describe('deleteVideo', () => {
  it('removes the video with the given id', () => {
    const result = deleteVideo('id-001')
    expect(result).toBe(true)
    expect(fs.writeFileSync).toHaveBeenCalledOnce()
    const written = JSON.parse(
      vi.mocked(fs.writeFileSync).mock.calls[0][1] as string
    ) as Video[]
    expect(written.some(v => v.id === 'id-001')).toBe(false)
  })

  it('returns false when id not found', () => {
    const result = deleteVideo('non-existent')
    expect(result).toBe(false)
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })
})
