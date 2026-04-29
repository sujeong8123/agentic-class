'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { deleteVideo, addVideo, updateVideo, extractYoutubeId } from '@/lib/videos'
import type { VideoInput } from '@/types/video'

export type FormState = {
  errors?: Record<string, string>
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

export async function deleteVideoAction(id: string) {
  deleteVideo(id)
  revalidatePath('/', 'layout')
}

function parseForm(formData: FormData): { input?: VideoInput; errors?: Record<string, string> } {
  const errors: Record<string, string> = {}

  const youtubeUrl = (formData.get('youtubeUrl') as string) ?? ''
  const title      = (formData.get('title') as string) ?? ''
  const level      = (formData.get('level') as string) ?? ''
  const genre      = (formData.get('genre') as string) ?? ''
  const arLevel    = (formData.get('arLevel') as string) ?? ''
  const duration   = (formData.get('duration') as string) ?? ''
  const channelName = (formData.get('channelName') as string) ?? ''
  const isKidsFriendly = formData.get('isKidsFriendly') === 'on'

  if (!youtubeUrl) errors.youtubeUrl = 'YouTube URL을 입력하세요.'
  if (!title)      errors.title      = '제목을 입력하세요.'
  if (!level)      errors.level      = '레벨을 선택하세요.'
  if (!genre)      errors.genre      = '장르를 선택하세요.'
  if (!arLevel)    errors.arLevel    = 'AR 레벨을 입력하세요.'

  const youtubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null
  if (youtubeUrl && !youtubeId) errors.youtubeUrl = '유효하지 않은 YouTube URL입니다.'

  if (Object.keys(errors).length > 0) return { errors }

  return {
    input: {
      youtubeId: youtubeId!,
      title: title.trim(),
      channelName: channelName.trim(),
      level: level as VideoInput['level'],
      genre: genre as VideoInput['genre'],
      isKidsFriendly,
      arLevel: parseFloat(arLevel),
      duration: duration.trim() || undefined,
    },
  }
}

export async function addVideoAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { input, errors } = parseForm(formData)
  if (errors) return { errors }
  addVideo(input!)
  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function updateVideoAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { input, errors } = parseForm(formData)
  if (errors) return { errors }
  updateVideo(id, input!)
  revalidatePath('/', 'layout')
  redirect('/admin')
}
