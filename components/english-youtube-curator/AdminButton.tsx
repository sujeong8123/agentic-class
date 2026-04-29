'use client'

import { useActionState, useState } from 'react'
import { loginAction } from '@/app/admin/login/actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AdminButton() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(loginAction, { error: '' })

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground font-medium">엄마만</span>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs text-primary shadow hover:bg-primary/20 transition-colors"
      >
        🔑 관리자
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>관리자 로그인</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="flex flex-col gap-3 mt-2">
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              autoFocus
            />
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? '확인 중...' : '입장'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
