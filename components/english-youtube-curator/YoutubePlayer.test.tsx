import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { YoutubePlayer } from './YoutubePlayer'

describe('YoutubePlayer', () => {
  it('renders a youtube-nocookie.com iframe', () => {
    render(<YoutubePlayer youtubeId="dQw4w9WgXcQ" title="Test Video" />)
    const iframe = screen.getByTestId('youtube-iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com'))
    expect(iframe).toHaveAttribute('src', expect.stringContaining('dQw4w9WgXcQ'))
  })

  it('does not link to any external youtube.com domain', () => {
    render(<YoutubePlayer youtubeId="dQw4w9WgXcQ" title="Test Video" />)
    const iframe = screen.getByTestId('youtube-iframe') as HTMLIFrameElement
    expect(iframe.src).not.toMatch(/^https:\/\/www\.youtube\.com/)
  })
})
