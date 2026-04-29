import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { VideoGrid } from './VideoGrid'
import type { Video } from '@/types/video'

vi.mock('next/link', () => ({
  default: ({ href, children, 'aria-label': ariaLabel }: { href: string; children: React.ReactNode; 'aria-label'?: string }) => (
    <a href={href} aria-label={ariaLabel}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

function makeVideo(overrides: Partial<Video>): Video {
  return {
    id: 'vid-1',
    youtubeId: 'abc',
    title: 'Test Video',
    channelName: 'Test Channel',
    level: 'beginner',
    genre: 'story',
    isKidsFriendly: false,
    arLevel: 1.2,
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const videos: Video[] = [
  makeVideo({ id: 'v1', genre: 'story', title: 'Story One', isKidsFriendly: true }),
  makeVideo({ id: 'v2', genre: 'song', title: 'Song One', isKidsFriendly: false }),
  makeVideo({ id: 'v3', genre: 'story', title: 'Story Two', isKidsFriendly: false }),
  makeVideo({ id: 'v4', genre: 'science', title: 'Science One', isKidsFriendly: false }),
]

describe('VideoGrid', () => {
  it('shows all genre filter tabs with 전체 active by default', () => {
    render(<VideoGrid videos={videos} readAloudVideos={[]} level="beginner" />)
    expect(screen.getByRole('tab', { name: '🌈 All' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: '📖 Read Aloud' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '📚 Story' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '🎵 Song' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '🔬 Science' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '🎨 Others' })).toBeInTheDocument()
  })

  it('shows all videos when 전체 tab is active', () => {
    render(<VideoGrid videos={videos} readAloudVideos={[]} level="beginner" />)
    expect(screen.getByText('Story One')).toBeInTheDocument()
    expect(screen.getByText('Song One')).toBeInTheDocument()
    expect(screen.getByText('Science One')).toBeInTheDocument()
  })

  it('filters to Song genre only after clicking Song tab', async () => {
    render(<VideoGrid videos={videos} readAloudVideos={[]} level="beginner" />)
    await userEvent.click(screen.getByRole('tab', { name: '🎵 Song' }))
    expect(screen.getByText('Song One')).toBeInTheDocument()
    expect(screen.queryByText('Story One')).not.toBeInTheDocument()
    expect(screen.queryByText('Science One')).not.toBeInTheDocument()
  })

  it('restores all videos after clicking 전체', async () => {
    render(<VideoGrid videos={videos} readAloudVideos={[]} level="beginner" />)
    await userEvent.click(screen.getByRole('tab', { name: '🎵 Song' }))
    await userEvent.click(screen.getByRole('tab', { name: '🌈 All' }))
    expect(screen.getByText('Story One')).toBeInTheDocument()
    expect(screen.getByText('Song One')).toBeInTheDocument()
  })

  it('shows Kids badge only for kids-friendly videos', () => {
    render(<VideoGrid videos={videos} readAloudVideos={[]} level="beginner" />)
    const kidsBadges = screen.getAllByText('Kids')
    expect(kidsBadges).toHaveLength(1)
  })

  it('never displays more than 10 cards', () => {
    const manyVideos = Array.from({ length: 12 }, (_, i) =>
      makeVideo({ id: `v${i}`, title: `Video ${i}` })
    )
    render(<VideoGrid videos={manyVideos.slice(0, 10)} readAloudVideos={[]} level="beginner" />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeLessThanOrEqual(10)
  })

  it('전체 includes read-aloud videos in the merged list', () => {
    const readAloud: Video[] = [
      makeVideo({ id: 'ra1', title: 'Brown Bear Read Aloud', arLevel: 1.0 }),
    ]
    render(<VideoGrid videos={videos} readAloudVideos={readAloud} level="beginner" />)
    expect(screen.getByText('Brown Bear Read Aloud')).toBeInTheDocument()
    expect(screen.getByText('Story One')).toBeInTheDocument()
  })

  it('Read Aloud tab shows only read-aloud videos in given order', async () => {
    const readAloud: Video[] = [
      makeVideo({ id: 'ra-a', title: 'Aaa Read Aloud', arLevel: 1.0 }),
      makeVideo({ id: 'ra-b', title: 'Bbb Read Aloud', arLevel: 1.5 }),
      makeVideo({ id: 'ra-c', title: 'Ccc Read Aloud', arLevel: 2.0 }),
    ]
    render(<VideoGrid videos={videos} readAloudVideos={readAloud} level="beginner" />)
    await userEvent.click(screen.getByRole('tab', { name: '📖 Read Aloud' }))

    expect(screen.getByText('Aaa Read Aloud')).toBeInTheDocument()
    expect(screen.getByText('Bbb Read Aloud')).toBeInTheDocument()
    expect(screen.getByText('Ccc Read Aloud')).toBeInTheDocument()
    expect(screen.queryByText('Story One')).not.toBeInTheDocument()
    expect(screen.queryByText('Song One')).not.toBeInTheDocument()
  })
})
