import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import type { Video } from '@/types/video'
import {
  extractYoutubeId,
  getVideosByLevel,
  getReadAloudVideos,
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

const manyBeginnerVideos: Video[] = Array.from({ length: 30 }, (_, i) => ({
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

  it('caps results at 20 even when more exist', () => {
    setupMock(manyBeginnerVideos)
    const result = getVideosByLevel('beginner')
    expect(result.length).toBe(20)
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

describe('getReadAloudVideos', () => {
  const readAloudVideos: Video[] = [
    { id: 'ra-b-1', youtubeId: 'yt1', title: 'Brown Bear Read Aloud', channelName: 'StoryTime', level: 'beginner', genre: 'story', isKidsFriendly: true, arLevel: 1.0, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'ra-b-2', youtubeId: 'yt2', title: 'Pete the Cat READ ALOUD', channelName: 'StoryTime', level: 'beginner', genre: 'story', isKidsFriendly: true, arLevel: 1.3, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'ra-b-3', youtubeId: 'yt3', title: 'Chicka Chicka read aloud', channelName: 'StoryTime', level: 'beginner', genre: 'story', isKidsFriendly: true, arLevel: 1.2, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'ra-i-1', youtubeId: 'yt4', title: 'Charlotte Web Read Aloud', channelName: 'Lit Kids', level: 'intermediate', genre: 'story', isKidsFriendly: true, arLevel: 3.1, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'ra-a-1', youtubeId: 'yt5', title: 'Holes Read Aloud', channelName: 'Lit Kids', level: 'advanced', genre: 'story', isKidsFriendly: false, arLevel: 4.6, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'no-ra-1', youtubeId: 'yt6', title: 'Beginner Song No RA', channelName: 'Ch', level: 'beginner', genre: 'song', isKidsFriendly: false, arLevel: 1.0, createdAt: '2024-01-01T00:00:00.000Z' },
  ]

  const manyReadAloudBeginners: Video[] = Array.from({ length: 20 }, (_, i) => ({
    id: `ra-many-${i}`,
    youtubeId: `ytm${i}`,
    title: `Book ${i} Read Aloud`,
    channelName: 'Ch',
    level: 'beginner' as const,
    genre: 'story' as const,
    isKidsFriendly: true,
    arLevel: 1.0 + i * 0.1,
    createdAt: '2024-01-01T00:00:00.000Z',
  }))

  it('returns only Read Aloud videos of the specified beginner level', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('beginner')
    expect(result.every(v => v.level === 'beginner')).toBe(true)
    expect(result.every(v => v.title.toLowerCase().includes('read aloud'))).toBe(true)
    expect(result).toHaveLength(3)
  })

  it('returns only Read Aloud videos of the specified intermediate level', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('intermediate')
    expect(result.every(v => v.level === 'intermediate')).toBe(true)
    expect(result).toHaveLength(1)
  })

  it('returns only Read Aloud videos of the specified advanced level', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('advanced')
    expect(result.every(v => v.level === 'advanced')).toBe(true)
    expect(result).toHaveLength(1)
  })

  it('filters case-insensitively (READ ALOUD, read aloud, Read Aloud all match)', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('beginner')
    const titles = result.map(v => v.title)
    expect(titles).toContain('Brown Bear Read Aloud')
    expect(titles).toContain('Pete the Cat READ ALOUD')
    expect(titles).toContain('Chicka Chicka read aloud')
  })

  it('returns videos sorted by arLevel ascending', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('beginner')
    expect(result.map(v => v.arLevel)).toEqual([1.0, 1.2, 1.3])
  })

  it('caps results at 12 when more than 12 Read Aloud videos exist', () => {
    setupMock(manyReadAloudBeginners)
    const result = getReadAloudVideos('beginner')
    expect(result).toHaveLength(12)
  })

  it('does not include Read Aloud videos from other levels', () => {
    setupMock(readAloudVideos)
    const result = getReadAloudVideos('beginner')
    expect(result.every(v => v.level === 'beginner')).toBe(true)
    expect(result.some(v => v.id === 'ra-i-1')).toBe(false)
    expect(result.some(v => v.id === 'ra-a-1')).toBe(false)
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
