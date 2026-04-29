const API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YoutubeVideoSnippet {
  youtubeId: string
  title: string
  channelTitle: string
  publishedAt: string
}

async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  const url = new URL(`${API_BASE}/channels`)
  url.searchParams.set('part', 'contentDetails')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY!)

  const res = await fetch(url.toString())
  if (!res.ok) return null
  const data = await res.json()
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null
}

export async function fetchLatestChannelVideos(
  channelId: string,
  maxResults = 10,
): Promise<YoutubeVideoSnippet[]> {
  const playlistId = await getUploadsPlaylistId(channelId)
  if (!playlistId) return []

  const url = new URL(`${API_BASE}/playlistItems`)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('playlistId', playlistId)
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY!)

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()

  return (data.items ?? []).map((item: { snippet: { resourceId: { videoId: string }, title: string, channelTitle: string, publishedAt: string } }) => ({
    youtubeId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }))
}
