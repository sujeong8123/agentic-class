'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: '' })

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-xs rounded-lg border bg-card p-8 shadow-sm space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-xl font-bold">엄마 전용</h1>
          <p className="text-sm text-muted-foreground mt-1">비밀번호를 입력해 주세요</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            autoFocus
            required
          />
          {state.error && (
            <p className="text-sm text-destructive text-center">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '확인 중...' : '들어가기'}
          </Button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
