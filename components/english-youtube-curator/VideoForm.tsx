'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Video } from '@/types/video'
import type { FormState } from '@/app/admin/actions'

interface VideoFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  defaultValues?: Partial<Video>
  cancelHref?: string
}

export function VideoForm({ action, defaultValues, cancelHref = '/admin' }: VideoFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <Field label="YouTube URL *" error={state.errors?.youtubeUrl}>
        <Input
          name="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={
            defaultValues?.youtubeId
              ? `https://www.youtube.com/watch?v=${defaultValues.youtubeId}`
              : ''
          }
        />
      </Field>

      <Field label="제목 *" error={state.errors?.title}>
        <Input name="title" placeholder="영상 제목" defaultValue={defaultValues?.title} />
      </Field>

      <Field label="채널명" error={undefined}>
        <Input name="channelName" placeholder="채널 이름" defaultValue={defaultValues?.channelName} />
      </Field>

      <Field label="레벨 *" error={state.errors?.level}>
        <Select name="level" defaultValue={defaultValues?.level}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="레벨 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="장르 *" error={state.errors?.genre}>
        <Select name="genre" defaultValue={defaultValues?.genre}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="장르 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="song">Song</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="other">기타</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="AR 레벨 *" error={state.errors?.arLevel}>
        <Input
          name="arLevel"
          type="number"
          step="0.1"
          min="0"
          max="10"
          placeholder="예: 1.5"
          defaultValue={defaultValues?.arLevel}
        />
      </Field>

      <Field label="길이 (예: 3:24)" error={undefined}>
        <Input name="duration" placeholder="3:24" defaultValue={defaultValues?.duration} />
      </Field>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isKidsFriendly"
          name="isKidsFriendly"
          defaultChecked={defaultValues?.isKidsFriendly}
        />
        <label htmlFor="isKidsFriendly" className="text-sm font-medium cursor-pointer">
          👶 Kids-friendly
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>취소</Link>
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
