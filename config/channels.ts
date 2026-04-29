import type { Video } from '@/types/video'

export interface ChannelRule {
  channelId: string
  channelName: string
  level: Video['level']
  genre: Video['genre']
  arLevel: number
  isKidsFriendly: boolean
}

// 채널 ID 확인 방법: 유튜브 채널 페이지 → 우클릭 → 페이지 소스 → "channelId" 검색
export const CHANNEL_RULES: ChannelRule[] = [
  {
    channelId: 'UCSimTeBBs58hp7cuzQkC2lQ',
    channelName: 'Super Simple Songs',
    level: 'beginner',
    genre: 'song',
    arLevel: 1.1,
    isKidsFriendly: true,
  },
  {
    channelId: 'UCbCmjCuTUZos6Inko4u57BA',
    channelName: 'CoComelon',
    level: 'beginner',
    genre: 'song',
    arLevel: 1.0,
    isKidsFriendly: true,
  },
  {
    channelId: 'UCXVCgDuD_QCkI7gTKU7-tpg', // TODO: 실제 채널 ID로 교체
    channelName: 'National Geographic Kids',
    level: 'intermediate',
    genre: 'science',
    arLevel: 2.5,
    isKidsFriendly: true,
  },
  {
    channelId: 'UCnpnIIVKtfCQDd5x87Tng4Q', // TODO: 실제 채널 ID로 교체
    channelName: 'SciShow Kids',
    level: 'intermediate',
    genre: 'science',
    arLevel: 3.0,
    isKidsFriendly: true,
  },
  {
    channelId: 'UCsooa4yRKGN_zEE8iknghZA', // TODO: 실제 채널 ID로 교체
    channelName: 'TED-Ed',
    level: 'advanced',
    genre: 'science',
    arLevel: 4.1,
    isKidsFriendly: false,
  },
  {
    channelId: 'UCAuUUnT6oDeKwE6v1NGQxug', // TODO: 실제 채널 ID로 교체
    channelName: 'TED Talks',
    level: 'advanced',
    genre: 'other',
    arLevel: 4.5,
    isKidsFriendly: false,
  },
]
