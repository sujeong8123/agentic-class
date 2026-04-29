'use client'

import type { Video } from '@/types/video'

type Genre = Video['genre'] | 'all' | 'read-aloud'

const GENRES: { id: Genre; label: string }[] = [
  { id: 'all', label: '🌈 All' },
  { id: 'read-aloud', label: '📖 Read Aloud' },
  { id: 'story', label: '📚 Story' },
  { id: 'song', label: '🎵 Song' },
  { id: 'science', label: '🔬 Science' },
  { id: 'other', label: '🎨 Others' },
]

interface GenreFilterProps {
  active: Genre
  onChange: (genre: Genre) => void
}

export type { Genre }

export function GenreFilter({ active, onChange }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="장르 필터">
      {GENRES.map((g) => (
        <button
          key={g.id}
          role="tab"
          aria-selected={active === g.id}
          onClick={() => onChange(g.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === g.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  )
}
