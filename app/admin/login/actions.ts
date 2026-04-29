'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get('password') as string
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '1234'

  if (password !== ADMIN_PASSWORD) {
    return { error: '비밀번호가 틀렸어요.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/admin')
}
