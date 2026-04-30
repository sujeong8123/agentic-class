import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadAloudSection } from './ReadAloudSection'
import type { Video } from '@/types/video'

const makeVideo = (overrides: Partial<Video> = {}): Video => ({
  id: 'vid-001',
  youtubeId: 'abc123',
  title: 'Brown Bear Read Aloud',
  channelName: 'StoryTime',
  level: 'beginner',
  genre: 'story',
  isKidsFriendly: true,
  arLevel: 1.0,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

const makeVideos = (count: number, level: Video['level'] = 'beginner'): Video[] =>
  Array.from({ length: count }, (_, i) =>
    makeVideo({ id: `vid-${i}`, youtubeId: `yt${i}`, title: `Book ${i} Read Aloud`, arLevel: 1.0 + i * 0.1, level })
  )

describe('ReadAloudSection', () => {
  it('renders the "📖 Read Aloud" section heading', () => {
    render(<ReadAloudSection videos={makeVideos(2)} level="beginner" />)
    expect(screen.getByRole('heading', { name: /Read Aloud/i })).toBeInTheDocument()
  })

  it('renders a card for each video', () => {
    const videos = makeVideos(8)
    render(<ReadAloudSection videos={videos} level="beginner" />)
    videos.forEach((v) => {
      expect(screen.getByText(v.title)).toBeInTheDocument()
    })
  })

  it('renders channel name for each video', () => {
    const videos = [makeVideo({ channelName: 'Brightly Storytime' })]
    render(<ReadAloudSection videos={videos} level="beginner" />)
    expect(screen.getByText('Brightly Storytime')).toBeInTheDocument()
  })

  it('renders AR level badge for each video', () => {
    const videos = [makeVideo({ arLevel: 1.5 })]
    render(<ReadAloudSection videos={videos} level="beginner" />)
    expect(screen.getByText('AR 1.5')).toBeInTheDocument()
  })

  it('renders a link to the watch page for each video', () => {
    const video = makeVideo({ id: 'vid-abc', level: 'beginner' })
    render(<ReadAloudSection videos={[video]} level="beginner" />)
    const link = screen.getByRole('link', { name: video.title })
    expect(link).toHaveAttribute('href', '/beginner/watch/vid-abc')
  })

  it('renders empty state when no videos are provided', () => {
    render(<ReadAloudSection videos={[]} level="beginner" />)
    expect(screen.getByText('준비 중이에요.')).toBeInTheDocument()
  })

  it('renders correctly for intermediate level', () => {
    const video = makeVideo({ id: 'vid-xyz', level: 'intermediate' })
    render(<ReadAloudSection videos={[video]} level="intermediate" />)
    const link = screen.getByRole('link', { name: video.title })
    expect(link).toHaveAttribute('href', '/intermediate/watch/vid-xyz')
  })
})
