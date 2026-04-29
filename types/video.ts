export interface Video {
  id: string
  youtubeId: string
  title: string
  channelName: string
  level: 'beginner' | 'intermediate' | 'advanced'
  genre: 'story' | 'song' | 'science' | 'other'
  isKidsFriendly: boolean
  arLevel: number
  duration?: string
  createdAt: string
}

export type VideoInput = Omit<Video, 'id' | 'createdAt'>
